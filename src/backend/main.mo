import Map "mo:core/Map";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
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

  type Admission = {
    fullName : Text;
    mobile : Text;
    dob : Text;
    idProofType : Text;
    address : Text;
    idProofFileKey : Text;
    email : Text;
    submittedAt : Int;
  };

  let admissionsStore = Map.empty<Nat, Admission>();
  var nextAdmissionId = 0;

  // attendance: key is "admissionId:date", value is Bool
  let attendanceStore = Map.empty<Text, Bool>();

  func attendanceKey(admissionId : Nat, date : Text) : Text {
    admissionId.toText() # ":" # date;
  };

  public shared ({ caller }) func submitAdmission(
    fullName : Text,
    mobile : Text,
    dob : Text,
    idProofType : Text,
    address : Text,
    idProofFileKey : Text,
    email : Text,
  ) : async () {
    let admission : Admission = {
      fullName;
      mobile;
      dob;
      idProofType;
      address;
      idProofFileKey;
      email;
      submittedAt = Time.now();
    };
    let currentId = nextAdmissionId;
    func findNextAvailableId(id : Nat) : Nat {
      switch (admissionsStore.get(id)) {
        case (null) { id };
        case (?_) { findNextAvailableId(id + 1) };
      };
    };
    let availableId = findNextAvailableId(currentId);
    nextAdmissionId := availableId + 1;
    admissionsStore.add(availableId, admission);
  };

  public query ({ caller }) func getTotalAdmissions() : async Nat {
    admissionsStore.size();
  };

  public query ({ caller }) func getAdmission(id : Nat) : async Admission {
    switch (admissionsStore.get(id)) {
      case (null) { Runtime.trap("Admission ID does not exist") };
      case (?admission) { admission };
    };
  };

  public query ({ caller }) func getAllAdmissions() : async [Admission] {
    admissionsStore.values().toArray();
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
