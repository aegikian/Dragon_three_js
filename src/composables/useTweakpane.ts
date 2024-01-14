import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import { Pane } from 'tweakpane'

let pane: Pane
let fpsGraph: any

export const useTweakPane = () => {
  pane = new Pane()
  pane.registerPlugin(EssentialsPlugin)
  //@ts-ignore
  fpsGraph = pane.addBlade({
    view: 'fpsgraph',
    label: 'fpsgraph'
  })
  return { pane, fpsGraph }
}
