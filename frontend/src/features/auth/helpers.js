import config from 'conf'

export const fetchUser = async (id) => {
  const res = await fetch(`${config.api.host}/api/users/${id}`, {
    credentials: 'include',
  })
  if (res.status !== 200) {
    console.error(res)
    return null
  }

  return await res.json()
}
