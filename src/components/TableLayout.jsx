import React from 'react';

function TableLayout({ allTables = [], availableTables = [], selectedTable, onSelectTable }) {
  // Function to check if a table is available
  const isAvailable = (tableId) => {
    return availableTables.some(at => at.id === tableId);
  };

  // Helper to get table dimensions based on capacity
  const getTableDims = (capacity) => {
    if (capacity <= 2) return { width: 40, height: 40, radius: '50%' }; // Round
    if (capacity <= 4) return { width: 50, height: 50, radius: '12px' }; // Square
    return { width: 70, height: 50, radius: '8px' }; // Rect
  };

  // Helper to render chairs based on capacity and dimensions
  const renderChairs = (capacity, width, height) => {
    const chairs = [];
    const chairSize = 12;
    const offset = -chairSize / 2; // Center chair on edge

    // Top and Bottom chairs
    if (capacity >= 2) {
      chairs.push(<div key="t1" className="absolute bg-mesa-text rounded-full shadow-sm" style={{ width: chairSize, height: chairSize, top: -chairSize + 4, left: '50%', transform: 'translateX(-50%)' }} />);
      chairs.push(<div key="b1" className="absolute bg-mesa-text rounded-full shadow-sm" style={{ width: chairSize, height: chairSize, bottom: -chairSize + 4, left: '50%', transform: 'translateX(-50%)' }} />);
    }

    // Side chairs for 4+
    if (capacity >= 4) {
      chairs.push(<div key="l1" className="absolute bg-mesa-text rounded-full shadow-sm" style={{ width: chairSize, height: chairSize, left: -chairSize + 4, top: '50%', transform: 'translateY(-50%)' }} />);
      chairs.push(<div key="r1" className="absolute bg-mesa-text rounded-full shadow-sm" style={{ width: chairSize, height: chairSize, right: -chairSize + 4, top: '50%', transform: 'translateY(-50%)' }} />);
    }

    // Extra side chairs for 6+
    if (capacity >= 6) {
      // Adjust previous side chairs to be top-ish and bottom-ish? 
      // Or just add more. Let's keep it simple: 2 on top, 2 on bottom for 6 seater rect?
      // Actually for 70px width, we can fit 2 on top/bottom.
      // Let's override for 6:
      return (
        <>
          <div className="absolute bg-mesa-text rounded-full shadow-sm" style={{ width: chairSize, height: chairSize, top: -chairSize + 4, left: '25%' }} />
          <div className="absolute bg-mesa-text rounded-full shadow-sm" style={{ width: chairSize, height: chairSize, top: -chairSize + 4, left: '75%' }} />
          <div className="absolute bg-mesa-text rounded-full shadow-sm" style={{ width: chairSize, height: chairSize, bottom: -chairSize + 4, left: '25%' }} />
          <div className="absolute bg-mesa-text rounded-full shadow-sm" style={{ width: chairSize, height: chairSize, bottom: -chairSize + 4, left: '75%' }} />
          <div className="absolute bg-mesa-text rounded-full shadow-sm" style={{ width: chairSize, height: chairSize, left: -chairSize + 4, top: '50%', transform: 'translateY(-50%)' }} />
          <div className="absolute bg-mesa-text rounded-full shadow-sm" style={{ width: chairSize, height: chairSize, right: -chairSize + 4, top: '50%', transform: 'translateY(-50%)' }} />
        </>
      );
    }

    return chairs;
  };

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {allTables.map(table => {
        const { width, height, radius } = getTableDims(table.capacity);
        const available = isAvailable(table.id);
        const selected = selectedTable?.id === table.id;

        return (
          <div
            key={table.id}
            className={`absolute flex items-center justify-center transition-all duration-300
              ${available ? 'cursor-pointer hover:scale-105 z-10' : 'cursor-not-allowed opacity-60 z-0'}
            `}
            style={{
              left: `${table.x}px`,
              top: `${table.y}px`,
              width: width,
              height: height,
            }}
            onClick={() => available && onSelectTable(table)}
            title={`Mesa ${table.tableNumber} - Capacidad: ${table.capacity}`}
          >
            {/* Chairs Layer */}
            {renderChairs(table.capacity, width, height)}

            {/* Table Surface */}
            <div
              className={`absolute inset-0 shadow-md flex items-center justify-center border-2 transition-colors
                ${available
                  ? 'bg-[#e8dcc0] border-[#cbbfa0]' // Wood-ish color
                  : 'bg-gray-300 border-gray-400'
                }
                ${selected && '!bg-green-500 !border-green-600 text-white ring-4 ring-green-200'}
              `}
              style={{ borderRadius: radius }}
            >
              <span className={`font-bold text-xs ${selected ? 'text-white' : 'text-[#8b7355]'}`}>
                {table.tableNumber}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TableLayout;
