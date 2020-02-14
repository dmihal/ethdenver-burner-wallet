let box = null;

export async function get3Box() {
  if (!box) {
    const pkg = await import('3box');
    box = pkg.default;
  }
  return box;
}

let _editProfile = null;
export async function getEditProfile() {
  if (!_editProfile) {
    const pkg = await import('3box-profile-edit-react');
    _editProfile = pkg.default;
  }
  return _editProfile;
}
