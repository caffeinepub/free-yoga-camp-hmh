import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import List "mo:core/List";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // OLD type kept for stable variable compatibility with existing data.
  // Do NOT remove this type -- it must match the previously stored Admission shape.
  type OldAdmission = {
    fullName : Text;
    mobile : Text;
    dob : Text;
    idProofType : Text;
    address : Text;
    idProofFileKey : Text;
    email : Text;
    submittedAt : Int;
  };

  // NEW type without id proof fields
  type Admission = {
    fullName : Text;
    mobile : Text;
    dob : Text;
    address : Text;
    email : Text;
    submittedAt : Int;
  };

  // Keep old store declared with OldAdmission type so stable data is compatible.
  // After migration this store is no longer used for writes.
  let admissionsStore = Map.empty<Nat, OldAdmission>();

  // New store without id proof fields
  let admissionsStoreV2 = Map.empty<Nat, Admission>();

  var nextAdmissionId = 0;

  // Migration flag -- set to true after first postupgrade run
  stable var _admissionsMigrationDone : Bool = false;

  // attendance: key is "admissionId:date", value is Bool
  let attendanceStore = Map.empty<Text, Bool>();

  func attendanceKey(admissionId : Nat, date : Text) : Text {
    admissionId.toText() # ":" # date;
  };

  // Migrate old admissions (with idProofType/idProofFileKey) into the new store.
  system func postupgrade() {
    if (not _admissionsMigrationDone) {
      var id = 0;
      while (id < nextAdmissionId) {
        switch (admissionsStore.get(id)) {
          case (?old) {
            admissionsStoreV2.add(id, {
              fullName = old.fullName;
              mobile = old.mobile;
              dob = old.dob;
              address = old.address;
              email = old.email;
              submittedAt = old.submittedAt;
            });
          };
          case (null) {};
        };
        id += 1;
      };
      _admissionsMigrationDone := true;
    };
  };

  public shared ({ caller }) func submitAdmission(
    fullName : Text,
    mobile : Text,
    dob : Text,
    address : Text,
    email : Text,
  ) : async () {
    let admission : Admission = {
      fullName;
      mobile;
      dob;
      address;
      email;
      submittedAt = Time.now();
    };
    func findNextAvailableId(id : Nat) : Nat {
      switch (admissionsStoreV2.get(id)) {
        case (null) { id };
        case (?_) { findNextAvailableId(id + 1) };
      };
    };
    let availableId = findNextAvailableId(nextAdmissionId);
    nextAdmissionId := availableId + 1;
    admissionsStoreV2.add(availableId, admission);
  };

  public query ({ caller }) func getTotalAdmissions() : async Nat {
    admissionsStoreV2.size();
  };

  public query ({ caller }) func getAdmission(id : Nat) : async Admission {
    switch (admissionsStoreV2.get(id)) {
      case (null) { Runtime.trap("Admission ID does not exist") };
      case (?admission) { admission };
    };
  };

  public query ({ caller }) func getAllAdmissions() : async [Admission] {
    admissionsStoreV2.values().toArray();
  };

  public shared ({ caller }) func markAttendance(admissionId : Nat, date : Text) : async () {
    let key = attendanceKey(admissionId, date);
    attendanceStore.add(key, true);
  };

  public shared ({ caller }) func removeAttendance(admissionId : Nat, date : Text) : async () {
    let key = attendanceKey(admissionId, date);
    attendanceStore.remove(key);
  };

  public query ({ caller }) func getAttendanceByDate(date : Text) : async [Nat] {
    let list = List.empty<Nat>();
    var id = 0;
    while (id < nextAdmissionId) {
      let key = attendanceKey(id, date);
      switch (attendanceStore.get(key)) {
        case (?true) { list.add(id) };
        case (_) {};
      };
      id += 1;
    };
    list.toArray();
  };

  public query ({ caller }) func getAllAttendanceDates() : async [Text] {
    var datesSet = Map.empty<Text, Bool>();
    for (key in attendanceStore.keys()) {
      // key format: "admissionId:date"
      let parts = key.split(#char ':');
      let partsArray = parts.toArray();
      if (partsArray.size() >= 2) {
        let date = partsArray[1];
        datesSet.add(date, true);
      };
    };
    datesSet.keys().toArray();
  };
};
