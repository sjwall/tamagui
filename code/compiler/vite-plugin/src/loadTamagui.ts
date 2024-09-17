import type { Logger, TamaguiOptions } from '@tamagui/static'

const importStatic = async () => {
  return (await import('@tamagui/static')).default
}

type StaticI = Awaited<ReturnType<typeof importStatic>>

export let tamaguiOptions: TamaguiOptions | null = null
export let Static: StaticI | null = null
export let extractor: ReturnType<StaticI['createExtractor']> | null = null
export let disableStatic = false

export const getStatic = async () => {
  if (Static) return Static
  Static = await importStatic()
  return Static!
}

export async function loadTamaguiBuildConfig(
  optionsIn?: Partial<TamaguiOptions>,
  logger?: Logger
) {
  // only do it once
  if (Static) return

  await getStatic()

  tamaguiOptions = Static!.loadTamaguiBuildConfigSync({
    ...optionsIn,
    platform: 'web',
  })

  if (optionsIn?.disableWatchTamaguiConfig) {
    return
  }

  disableStatic = Boolean(tamaguiOptions.disable)
  extractor = Static!.createExtractor({
    logger,
  })

  await extractor!.loadTamagui({
    components: ['tamagui'],
    platform: 'web',
    ...tamaguiOptions,
  } satisfies TamaguiOptions)
}
