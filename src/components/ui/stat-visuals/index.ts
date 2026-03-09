import type { ComponentType } from 'react'
import { ComparisonBars } from './ComparisonBars'
import { RisingBars } from './RisingBars'
import { DonutChart } from './DonutChart'
import { GapBars } from './GapBars'
import { CostBlocks } from './CostBlocks'

export { ComparisonBars, RisingBars, DonutChart, GapBars, CostBlocks }

export const VISUAL_MAP: Record<string, ComponentType> = {
  comparison: ComparisonBars,
  rising: RisingBars,
  donut: DonutChart,
  gap: GapBars,
  cost: CostBlocks,
}
