import { useState, useMemo, useCallback } from 'react'
import { useStore } from '../store/useStore'
import { formatNaira } from '../lib/utils'
import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'
import { FinosIcon } from '../components/icons/FinosIcons'
import type { PolicyAllocation, PoolType, Pool } from '../types'
import { generateId } from '../lib/utils'

const PREVIEW_INCOME = 500000

const CUSTOM_COLORS = [
  '#4F6DA8', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4',
  '#EC4899', '#EF4444', '#64748B', '#14B8A6', '#F97316',
]

const CUSTOM_ICONS = [
  'wallet', 'coins', 'landmark', 'banknote', 'credit-card',
  'globe', 'smartphone', 'target', 'star', 'zap',
]

export default function AllocationPolicy() {
  const { policies, pools, updatePolicy } = useStore()
  const activePolicy = policies.find((p) => p.isDefault)

  const [allocations, setAllocations] = useState<PolicyAllocation[]>(() =>
    activePolicy ? activePolicy.allocations.map((a) => ({ ...a })) : []
  )

  const [showAddSheet, setShowAddSheet] = useState(false)
  const [customMode, setCustomMode] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customColor, setCustomColor] = useState(CUSTOM_COLORS[0])
  const [customIcon, setCustomIcon] = useState(CUSTOM_ICONS[0])

  const totalPercent = useMemo(
    () => allocations.reduce((s, a) => s + a.percentage, 0),
    [allocations]
  )

  const isValid = totalPercent === 100

  const allocatedPoolIds = useMemo(
    () => new Set(allocations.map((a) => a.poolId)),
    [allocations]
  )

  const availablePools = useMemo(
    () => pools.filter((p) => !p.parentId && !allocatedPoolIds.has(p.id)),
    [pools, allocatedPoolIds]
  )

  const updatePercentage = useCallback((poolId: string, value: number) => {
    setAllocations((prev) =>
      prev.map((a) => (a.poolId === poolId ? { ...a, percentage: value } : a))
    )
  }, [])

  const removeAllocation = useCallback((poolId: string) => {
    setAllocations((prev) => prev.filter((a) => a.poolId !== poolId))
  }, [])

  const moveAllocation = useCallback((index: number, direction: -1 | 1) => {
    setAllocations((prev) => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      const temp = next[index]
      next[index] = next[target]
      next[target] = temp
      return next
    })
  }, [])

  const addFromPool = useCallback((pool: Pool) => {
    const alloc: PolicyAllocation = {
      poolId: pool.id,
      poolName: pool.name,
      percentage: 0,
      poolType: pool.type,
      icon: pool.icon,
      color: pool.color,
    }
    setAllocations((prev) => [...prev, alloc])
    setShowAddSheet(false)
  }, [])

  const addCustom = useCallback(() => {
    if (!customName.trim()) return
    const id = 'pool-custom-' + generateId()
    const alloc: PolicyAllocation = {
      poolId: id,
      poolName: customName.trim(),
      percentage: 0,
      poolType: 'custom' as PoolType,
      icon: customIcon,
      color: customColor,
    }
    setAllocations((prev) => [...prev, alloc])
    setCustomName('')
    setCustomColor(CUSTOM_COLORS[0])
    setCustomIcon(CUSTOM_ICONS[0])
    setCustomMode(false)
    setShowAddSheet(false)
  }, [customName, customColor, customIcon])

  const handleSave = () => {
    if (!activePolicy || !isValid) return
    updatePolicy(activePolicy.id, { allocations })
  }

  return (
    <PageContainer>
      <Header title="Allocation Policy" showBack />

      <div className="pt-4 space-y-5">
        <div className="animate-fade-in">
          <p className="text-[12px] text-gray-400 font-medium">
            Adjust how your income is distributed across pools.
          </p>
        </div>

        <div
          className={`flex items-center justify-between px-4 py-3.5 rounded-[16px] transition-all animate-fade-in ${
            isValid
              ? 'bg-[#E8F5E9]'
              : totalPercent > 100
              ? 'bg-[#FFEBEE]'
              : 'bg-[#FFF8E1]'
          }`}
          style={{ animationDelay: '40ms' }}
        >
          <div className="flex items-center gap-3">
            <FinosIcon
              name={isValid ? 'check-circle' : 'alert-circle'}
              size={20}
              className={
                isValid
                  ? 'text-[#2E7D32]'
                  : totalPercent > 100
                  ? 'text-[#C62828]'
                  : 'text-[#E65100]'
              }
            />
            <div>
              <p className="text-[14px] font-bold text-[#013D7C] dark:text-white tabular-nums">
                {totalPercent}%
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                {isValid
                  ? 'Allocations balance'
                  : totalPercent > 100
                  ? `${totalPercent - 100}% over`
                  : `${100 - totalPercent}% remaining`}
              </p>
            </div>
          </div>
          <div className="relative w-10 h-10">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={isValid ? '#2E7D32' : totalPercent > 100 ? '#C62828' : '#E65100'}
                strokeWidth="3"
                strokeDasharray={`${Math.min(totalPercent, 100)}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-[#013D7C] dark:text-white">
              {totalPercent}
            </span>
          </div>
        </div>

        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '80ms' }}>
          {allocations.map((alloc, index) => {
            const previewAmount = Math.round((PREVIEW_INCOME * alloc.percentage) / 100)
            return (
              <div
                key={alloc.poolId}
                className="bg-white dark:bg-[#1A2332] rounded-[16px] p-4 animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex items-center justify-center w-9 h-9 rounded-[10px] shrink-0"
                    style={{ backgroundColor: alloc.color + '10' }}
                  >
                    <span style={{ color: alloc.color }}>
                      <FinosIcon name={alloc.icon} size={18} />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-bold text-[#013D7C] dark:text-white block truncate tracking-[-0.01em]">
                      {alloc.poolName}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {formatNaira(previewAmount)}
                    </span>
                  </div>
                  <span
                    className={`text-[16px] font-bold tabular-nums tracking-[-0.02em] ${
                      alloc.percentage > 0 ? 'text-[#013D7C] dark:text-white' : 'text-gray-200 dark:text-gray-700'
                    }`}
                  >
                    {alloc.percentage}%
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={alloc.percentage}
                  onChange={(e) => updatePercentage(alloc.poolId, parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
                />

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => moveAllocation(index, -1)}
                      disabled={index === 0}
                      className="flex items-center justify-center w-7 h-7 rounded-[8px] text-gray-400 active:bg-gray-50 dark:active:bg-gray-800 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      <FinosIcon name="chevron-up" size={16} />
                    </button>
                    <button
                      onClick={() => moveAllocation(index, 1)}
                      disabled={index === allocations.length - 1}
                      className="flex items-center justify-center w-7 h-7 rounded-[8px] text-gray-400 active:bg-gray-50 dark:active:bg-gray-800 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      <FinosIcon name="chevron-down" size={16} />
                    </button>
                  </div>

                  {allocations.length > 1 && (
                    <button
                      onClick={() => removeAllocation(alloc.poolId)}
                      className="flex items-center justify-center w-7 h-7 rounded-[8px] text-gray-300 dark:text-gray-600 active:text-[#C62828] active:bg-[#FFEBEE] transition-colors"
                    >
                      <FinosIcon name="trash" size={14} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={() => {
            setCustomMode(false)
            setShowAddSheet(true)
          }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[16px] border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 text-[13px] font-semibold active:border-gray-300 dark:active:border-gray-600 active:text-gray-500 transition-all animate-fade-in"
          style={{ animationDelay: `${allocations.length * 30 + 80}ms` }}
        >
          <FinosIcon name="plus" size={16} />
          Add Allocation
        </button>

        <div className="bg-white dark:bg-[#1A2332] rounded-[16px] p-4 animate-fade-in" style={{ animationDelay: `${allocations.length * 30 + 120}ms` }}>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3">
            Preview — If {formatNaira(PREVIEW_INCOME)} enters
          </p>
          <div className="space-y-2.5">
            {allocations.filter((a) => a.percentage > 0).map((alloc) => {
              const previewAmount = Math.round((PREVIEW_INCOME * alloc.percentage) / 100)
              return (
                <div key={alloc.poolId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: alloc.color }}
                    />
                    <span className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">{alloc.poolName}</span>
                    <span className="text-[10px] text-gray-300 dark:text-gray-600 font-medium">{alloc.percentage}%</span>
                  </div>
                  <span className="text-[12px] font-bold text-[#013D7C] dark:text-white tabular-nums">{formatNaira(previewAmount)}</span>
                </div>
              )
            })}
          </div>
          {allocations.filter((a) => a.percentage > 0).length === 0 && (
            <p className="text-[12px] text-gray-300 dark:text-gray-600 text-center py-3 font-medium">
              Move sliders to see preview
            </p>
          )}
          <div className="border-t border-gray-100 dark:border-gray-700/50 mt-3 pt-3 flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Total</span>
            <span className={`text-[13px] font-bold ${isValid ? 'text-[#2E7D32]' : 'text-[#C62828]'}`}>
              {formatNaira(
                allocations.reduce(
                  (s, a) => s + Math.round((PREVIEW_INCOME * a.percentage) / 100),
                  0
                )
              )}
            </span>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!isValid}
          className="w-full bg-[#013D7C] text-white text-[14px] font-bold py-3.5 rounded-[14px] transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] animate-fade-in"
          style={{ animationDelay: `${allocations.length * 30 + 160}ms` }}
        >
          Save Policy
        </button>
      </div>

      {showAddSheet && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowAddSheet(false)
              setCustomMode(false)
              setCustomName('')
            }}
          />
          <div className="relative bg-white dark:bg-[#1A2332] w-full max-w-lg rounded-t-[28px] p-5 pb-8 animate-slide-up">
            <div className="w-8 h-[3px] bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />

            {!customMode ? (
              <>
                <h3 className="text-[15px] font-bold text-[#013D7C] dark:text-white mb-1">Add Allocation</h3>
                <p className="text-[12px] text-gray-400 font-medium mb-4">
                  Choose a pool or create a custom allocation
                </p>

                {availablePools.length > 0 && (
                  <div className="space-y-1.5 mb-4 max-h-64 overflow-y-auto">
                    {availablePools.map((pool) => (
                      <button
                        key={pool.id}
                        onClick={() => addFromPool(pool)}
                        className="flex items-center gap-3 w-full p-3 rounded-[12px] active:bg-gray-50 dark:active:bg-gray-800 transition-colors text-left"
                      >
                        <div
                          className="flex items-center justify-center w-9 h-9 rounded-[10px] shrink-0"
                          style={{ backgroundColor: pool.color + '10' }}
                        >
                          <span style={{ color: pool.color }}>
                            <FinosIcon name={pool.icon} size={18} />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-[#013D7C] dark:text-white">{pool.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{pool.type}</p>
                        </div>
                        <FinosIcon name="plus" size={16} className="text-gray-300 dark:text-gray-600" />
                      </button>
                    ))}
                  </div>
                )}

                {availablePools.length === 0 && (
                  <p className="text-[12px] text-gray-400 text-center py-4 mb-4 font-medium">
                    All pools are already in the policy.
                  </p>
                )}

                <button
                  onClick={() => setCustomMode(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-[12px] border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-[13px] font-semibold active:border-gray-300 dark:active:border-gray-600 transition-all"
                >
                  <FinosIcon name="plus" size={16} />
                  Create Custom Allocation
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#013D7C] dark:text-white">Custom Allocation</h3>
                    <p className="text-[11px] text-gray-400 font-medium">Name it and pick a color</p>
                  </div>
                  <button
                    onClick={() => {
                      setCustomMode(false)
                      setCustomName('')
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded-xl active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
                  >
                    <FinosIcon name="x" size={18} className="text-gray-400" />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Pool name (e.g. Travel Fund)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-4 py-3 rounded-[12px] border border-gray-200 dark:border-gray-700 text-[13px] text-[#013D7C] dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-[#013D7C] dark:focus:border-gray-500 transition-colors mb-4"
                  autoFocus
                />

                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                  Icon
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {CUSTOM_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setCustomIcon(icon)}
                      className={`flex items-center justify-center w-10 h-10 rounded-[10px] border-2 transition-all ${
                        customIcon === icon
                          ? 'border-[#013D7C] bg-[#013D7C]/5'
                          : 'border-gray-100 dark:border-gray-700 active:border-gray-200 dark:active:border-gray-600'
                      }`}
                    >
                      <FinosIcon
                        name={icon}
                        size={18}
                        className={customIcon === icon ? 'text-[#013D7C]' : 'text-gray-400'}
                      />
                    </button>
                  ))}
                </div>

                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                  Color
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {CUSTOM_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCustomColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        customColor === color
                          ? 'border-[#013D7C] scale-110'
                          : 'border-transparent active:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <button
                  onClick={addCustom}
                  disabled={!customName.trim()}
                  className="w-full bg-[#013D7C] text-white text-[13px] font-bold py-3.5 rounded-[12px] transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  Add Custom Allocation
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  )
}