import { faClock } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function CriticalRequestCard() {
  return<>
          <div className="relative bg-bg-card/80 rounded-2xl px-1 py-4 text-heading shadow-card">
          <div className="flex flex-col gap-2 px-3">
            {/* ID + Badge */}
            <div className="flex items-center justify-between gap-2 text-xs text-muted">
              <span>REQ-2025-001</span>
              <span className="rounded-full critical-gradient px-2 py-0.5 text-[10px] font-semibold text-white">
                URGENT
              </span>
            </div>

            {/* Name */}
            <h3 className="text-sm font-semibold text-heading leading-tight">
              Ahmed Hassan
            </h3>

            {/* Description */}
            <p className="text-xs text-muted max-w-xl">
              Severe chest pain, difficulty breathing
            </p>

            {/* Time */}
            <div className="flex items-center gap-1 text-xs text-red-400">
              <span>
                <FontAwesomeIcon icon={faClock} />
              </span>
              <span>2 mins ago</span>
            </div>
          </div>
        </div>
  
  
  </>
}
