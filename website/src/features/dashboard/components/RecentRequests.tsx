import { RequestRow } from "@/shared/ui/RequestRow";
import React from "react";
import CriticalRequests from "./CriticalRequests";

export default function RecentRequests() {
  return (
    <>
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 my-6 md:my-8">
        <div className="col-span-1 lg:col-span-8 bg-bg-card dark:bg-bg-card rounded-lg md:rounded-2xl shadow-card dark:shadow-card overflow-hidden">
          <div className="header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 p-4 md:p-6 font-semibold text-base md:text-lg text-heading dark:text-heading border-b border-border">
            <span>Recent Requests</span>
            <button className="text-xs cursor-pointer bg-primary text-white px-3 md:px-4 py-2 rounded-full hover:opacity-90 transition self-start sm:self-auto">
              View All
            </button>
          </div>
          <div className="requests-list divide-y divide-border bg-bg-card dark:bg-bg-card">
            <RequestRow />
            <RequestRow
              id={"REQ-2025-001"}
              userName="khale ahmed"
              userPhone="+966501234567"
              location="King Fahd Road, Riyadh"
              priority="high"
              status="en-route"
              timestamp="2 mins ago"
            />
            <RequestRow
              id={"REQ-2025-001"}
              userName="mohamed ahmed"
              userPhone="+966501234567"
              location="King Fahd Road, Riyadh"
              priority="low"
              status="completed"
              timestamp="2 mins ago"
            />
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-4">
          <CriticalRequests/>
        </div>
      </div>
      
    </>
  );
}
