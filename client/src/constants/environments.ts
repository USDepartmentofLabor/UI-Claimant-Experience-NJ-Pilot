const NEXT_ENVS = ['local', 'development', 'test', 'production'] as const

export type NextPublicAppEnv = typeof NEXT_ENVS[number]
