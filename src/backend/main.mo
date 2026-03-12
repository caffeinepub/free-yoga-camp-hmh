import Map "mo:core/Map";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Include MixinAuthorization for authorization logic
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Include MixinStorage for blob storage
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

  // Store admissions using persistent Map storage
  let admissionsStore = Map.empty<Nat, Admission>();
  var nextAdmissionId = 0;

  public shared ({ caller }) func submitAdmission(
    fullName : Text,
    mobile : Text,
    dob : Text,
    idProofType : Text,
    address : Text,
    idProofFileKey : Text,
    email : Text,
  ) : async () {
    // Create new admission record
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

    // Find next available admission ID (use binary search for efficiency)
    let currentId = nextAdmissionId;
    func findNextAvailableId(id : Nat) : Nat {
      switch (admissionsStore.get(id)) {
        case (null) { id };
        case (?_) { findNextAvailableId(id + 1) };
      };
    };

    let availableId = findNextAvailableId(currentId);
    nextAdmissionId := availableId + 1;

    // Save admission record in the persistent store
    admissionsStore.add(availableId, admission);
  };

  public query ({ caller }) func getTotalAdmissions() : async Nat {
    admissionsStore.size();
  };

  public query ({ caller }) func getAdmission(id : Nat) : async Admission {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access admission records");
    };
    switch (admissionsStore.get(id)) {
      case (null) { Runtime.trap("Admission ID does not exist") };
      case (?admission) { admission };
    };
  };

  public query ({ caller }) func getAllAdmissions() : async [Admission] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access all admissions");
    };
    admissionsStore.values().toArray();
  };
};
