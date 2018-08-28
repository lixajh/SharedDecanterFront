const getters = {
  sidebar: state => state.app.sidebar,
  login_status: state => state.user.login_status,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  default_operator_id: state => state.user.default_operator_id
}
export default getters
