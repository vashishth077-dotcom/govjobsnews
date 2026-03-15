import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module AutoIncrement {
    public type State = {
      nextId : Nat;
    };

    public func getNextId(state : State) : (State, Nat) {
      let id = state.nextId;
      ({ nextId = id + 1 }, id);
    };
  };

  // Data Types
  type Job = {
    id : Nat;
    title : Text;
    department : Text;
    organization : Text;
    qualification : Text;
    vacancies : Nat;
    lastDate : Text;
    category : Text;
    officialLink : Text;
    postedDate : Int;
    isActive : Bool;
  };

  type Result = {
    id : Nat;
    title : Text;
    examBoard : Text;
    resultDate : Text;
    officialLink : Text;
    postedDate : Int;
    isActive : Bool;
  };

  type AdmitCard = {
    id : Nat;
    examName : Text;
    examBoard : Text;
    downloadLink : Text;
    examDate : Text;
    postedDate : Int;
    isActive : Bool;
  };

  type Notification = {
    id : Nat;
    title : Text;
    description : Text;
    date : Text;
    link : Text;
    postedDate : Int;
    isActive : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  // State management
  let jobs = Map.empty<Nat, Job>();
  let results = Map.empty<Nat, Result>();
  let admitCards = Map.empty<Nat, AdmitCard>();
  let notifications = Map.empty<Nat, Notification>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var jobIdCounter : AutoIncrement.State = { nextId = 1 };
  var resultIdCounter : AutoIncrement.State = { nextId = 1 };
  var admitCardIdCounter : AutoIncrement.State = { nextId = 1 };
  var notificationIdCounter : AutoIncrement.State = { nextId = 1 };

  module Job {
    public func compareByPostedDate(a : Job, b : Job) : Order.Order {
      return Int.compare(b.postedDate, a.postedDate); // Newest first
    };
  };

  module Result {
    public func compareByPostedDate(a : Result, b : Result) : Order.Order {
      return Int.compare(b.postedDate, a.postedDate);
    };
  };

  module AdmitCard {
    public func compareByPostedDate(a : AdmitCard, b : AdmitCard) : Order.Order {
      return Int.compare(b.postedDate, a.postedDate);
    };
  };

  module Notification {
    public func compareByPostedDate(a : Notification, b : Notification) : Order.Order {
      return Int.compare(b.postedDate, a.postedDate);
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Job CRUD operations
  public shared ({ caller }) func createJob(title : Text, department : Text, organization : Text, qualification : Text, vacancies : Nat, lastDate : Text, category : Text, officialLink : Text) : async Job {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create jobs");
    };

    let (newCounter, id) = AutoIncrement.getNextId(jobIdCounter);
    jobIdCounter := newCounter;

    let job : Job = {
      id;
      title;
      department;
      organization;
      qualification;
      vacancies;
      lastDate;
      category;
      officialLink;
      postedDate = Time.now();
      isActive = true;
    };

    jobs.add(id, job);
    job;
  };

  public shared ({ caller }) func updateJob(id : Nat, title : Text, department : Text, organization : Text, qualification : Text, vacancies : Nat, lastDate : Text, category : Text, officialLink : Text, isActive : Bool) : async Job {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update jobs");
    };

    switch (jobs.get(id)) {
      case (null) { Runtime.trap("Job not found") };
      case (?existingJob) {
        let updatedJob : Job = {
          id;
          title;
          department;
          organization;
          qualification;
          vacancies;
          lastDate;
          category;
          officialLink;
          postedDate = existingJob.postedDate;
          isActive;
        };
        jobs.add(id, updatedJob);
        updatedJob;
      };
    };
  };

  public shared ({ caller }) func deleteJob(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete jobs");
    };

    switch (jobs.get(id)) {
      case (null) { Runtime.trap("Job not found") };
      case (?_) {
        jobs.remove(id);
      };
    };
  };

  // Result CRUD operations
  public shared ({ caller }) func createResult(title : Text, examBoard : Text, resultDate : Text, officialLink : Text) : async Result {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create results");
    };

    let (newCounter, id) = AutoIncrement.getNextId(resultIdCounter);
    resultIdCounter := newCounter;

    let result : Result = {
      id;
      title;
      examBoard;
      resultDate;
      officialLink;
      postedDate = Time.now();
      isActive = true;
    };

    results.add(id, result);
    result;
  };

  public shared ({ caller }) func updateResult(id : Nat, title : Text, examBoard : Text, resultDate : Text, officialLink : Text, isActive : Bool) : async Result {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update results");
    };

    switch (results.get(id)) {
      case (null) { Runtime.trap("Result not found") };
      case (?existingResult) {
        let updatedResult : Result = {
          id;
          title;
          examBoard;
          resultDate;
          officialLink;
          postedDate = existingResult.postedDate;
          isActive;
        };
        results.add(id, updatedResult);
        updatedResult;
      };
    };
  };

  public shared ({ caller }) func deleteResult(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete results");
    };

    switch (results.get(id)) {
      case (null) { Runtime.trap("Result not found") };
      case (?_) {
        results.remove(id);
      };
    };
  };

  // Admit Card CRUD operations
  public shared ({ caller }) func createAdmitCard(examName : Text, examBoard : Text, downloadLink : Text, examDate : Text) : async AdmitCard {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create admit cards");
    };

    let (newCounter, id) = AutoIncrement.getNextId(admitCardIdCounter);
    admitCardIdCounter := newCounter;

    let admitCard : AdmitCard = {
      id;
      examName;
      examBoard;
      downloadLink;
      examDate;
      postedDate = Time.now();
      isActive = true;
    };

    admitCards.add(id, admitCard);
    admitCard;
  };

  public shared ({ caller }) func updateAdmitCard(id : Nat, examName : Text, examBoard : Text, downloadLink : Text, examDate : Text, isActive : Bool) : async AdmitCard {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update admit cards");
    };

    switch (admitCards.get(id)) {
      case (null) { Runtime.trap("Admit card not found") };
      case (?existingAdmitCard) {
        let updatedAdmitCard : AdmitCard = {
          id;
          examName;
          examBoard;
          downloadLink;
          examDate;
          postedDate = existingAdmitCard.postedDate;
          isActive;
        };
        admitCards.add(id, updatedAdmitCard);
        updatedAdmitCard;
      };
    };
  };

  public shared ({ caller }) func deleteAdmitCard(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete admit cards");
    };

    switch (admitCards.get(id)) {
      case (null) { Runtime.trap("Admit card not found") };
      case (?_) {
        admitCards.remove(id);
      };
    };
  };

  // Notification CRUD operations
  public shared ({ caller }) func createNotification(title : Text, description : Text, date : Text, link : Text) : async Notification {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create notifications");
    };

    let (newCounter, id) = AutoIncrement.getNextId(notificationIdCounter);
    notificationIdCounter := newCounter;

    let notification : Notification = {
      id;
      title;
      description;
      date;
      link;
      postedDate = Time.now();
      isActive = true;
    };

    notifications.add(id, notification);
    notification;
  };

  public shared ({ caller }) func updateNotification(id : Nat, title : Text, description : Text, date : Text, link : Text, isActive : Bool) : async Notification {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update notifications");
    };

    switch (notifications.get(id)) {
      case (null) { Runtime.trap("Notification not found") };
      case (?existingNotification) {
        let updatedNotification : Notification = {
          id;
          title;
          description;
          date;
          link;
          postedDate = existingNotification.postedDate;
          isActive;
        };
        notifications.add(id, updatedNotification);
        updatedNotification;
      };
    };
  };

  public shared ({ caller }) func deleteNotification(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete notifications");
    };

    switch (notifications.get(id)) {
      case (null) { Runtime.trap("Notification not found") };
      case (?_) {
        notifications.remove(id);
      };
    };
  };

  // Public queries - no authorization required
  public query ({ caller }) func getActiveJobs() : async [Job] {
    jobs.values().toArray().filter(func(j) { j.isActive }).sort(Job.compareByPostedDate);
  };

  public query ({ caller }) func getActiveResults() : async [Result] {
    results.values().toArray().filter(func(r) { r.isActive }).sort(Result.compareByPostedDate);
  };

  public query ({ caller }) func getActiveAdmitCards() : async [AdmitCard] {
    admitCards.values().toArray().filter(func(a) { a.isActive }).sort(AdmitCard.compareByPostedDate);
  };

  public query ({ caller }) func getActiveNotifications() : async [Notification] {
    notifications.values().toArray().filter(func(n) { n.isActive }).sort(Notification.compareByPostedDate);
  };

  public query ({ caller }) func getJob(id : Nat) : async Job {
    switch (jobs.get(id)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) { job };
    };
  };

  public query ({ caller }) func getResult(id : Nat) : async Result {
    switch (results.get(id)) {
      case (null) { Runtime.trap("Result not found") };
      case (?result) { result };
    };
  };

  public query ({ caller }) func getAdmitCard(id : Nat) : async AdmitCard {
    switch (admitCards.get(id)) {
      case (null) { Runtime.trap("Admit card not found") };
      case (?admitCard) { admitCard };
    };
  };

  public query ({ caller }) func getNotification(id : Nat) : async Notification {
    switch (notifications.get(id)) {
      case (null) { Runtime.trap("Notification not found") };
      case (?notification) { notification };
    };
  };

  public query ({ caller }) func searchJobsByCategory(category : Text) : async [Job] {
    jobs.values().toArray().filter(func(j) { j.isActive and Text.equal(j.category, category) }).sort(Job.compareByPostedDate);
  };

  public query ({ caller }) func searchJobsByKeyword(keyword : Text) : async [Job] {
    jobs.values().toArray().filter(func(j) { j.isActive and j.title.contains(#text keyword) }).sort(Job.compareByPostedDate);
  };
};
