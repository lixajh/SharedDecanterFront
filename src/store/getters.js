const getters = {
  sidebar: state => state.app.sidebar,
  login_status: state => state.user.login_status,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
}
export default getters
