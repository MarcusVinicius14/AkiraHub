"use client";
import React, { useState } from "react";

export default function StatusFilter() {
  const statusOptions = ["Lançando", "Hiato", "Finalizado"];
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-green-500 text-white rounded-md"
      >
        {open ? "Esconder Status" : "Ver Status"}
      </button>
      {open && (
        <div className="mt-2 p-2 bg-white rounded-md shadow-md">
          <div className="flex flex-col gap-2">
            {statusOptions.map((status, index) => (
              <button
                key={index}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1 border rounded-full text-sm transition hover:bg-green-500 hover:text-white ${
                  selectedStatus === status ? "bg-green-500 text-white" : ""
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
