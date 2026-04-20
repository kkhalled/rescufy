enum UserRole {
  user,
  paramedic;

  bool get isParamedic => this == UserRole.paramedic;
  bool get isUser => this == UserRole.user;

  bool get canLoginFromMobile {
    return true;
  }
}
