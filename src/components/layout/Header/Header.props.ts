export interface Route {
  path: string
  title: string
}

export type MyRoutes = Route[]

export interface HeaderProps {
  backgroundColor?: string
  repoHref?: string
  avatarImageSrc?: string
}
