export interface Chat {
  id: string
  message: string
  response: string
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: string
  name: string
}

export interface Comic {
  id: string
  tone: string
  difficulty: string
  topic: string
  images: string[]
  tags: Tag[]
  chats: Chat[]
  createdAt: string
  updatedAt: string
}

export interface ComicTag {
  id: string
  tags: string[]
}

