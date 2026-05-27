import { View, Text } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { COLORS } from '@/constants/theme'

interface Ring {
  value: number
  max: number
  color: string
  label: string
}

interface ActivityRingProps {
  rings: Ring[]
  size?: number
}

export function ActivityRing({ rings, size = 160 }: ActivityRingProps) {
  const center = size / 2
  const strokeWidth = 14
  const gap = 6

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {rings.map((ring, i) => {
          const radius = center - strokeWidth / 2 - i * (strokeWidth + gap)
          const circumference = 2 * Math.PI * radius
          const pct = Math.min(ring.value / ring.max, 1)
          const dash = circumference * pct

          return (
            <React.Fragment key={ring.label}>
              <Circle
                cx={center} cy={center} r={radius}
                fill="none" stroke={ring.color}
                strokeWidth={strokeWidth} opacity={0.15}
              />
              <Circle
                cx={center} cy={center} r={radius}
                fill="none" stroke={ring.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`}
              />
            </React.Fragment>
          )
        })}
      </Svg>

      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: '900', color: '#fff' }}>
          {Math.round((rings[0].value / rings[0].max) * 100)}%
        </Text>
        <Text style={{ fontSize: 10, color: COLORS.gray, marginTop: 2 }}>activité</Text>
      </View>
    </View>
  )
}

import React from 'react'
