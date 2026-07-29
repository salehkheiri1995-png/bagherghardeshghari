"use client";

import dynamic from "next/dynamic";

interface TourMapProps {
  latitude: number;
  longitude: number;
  tourName: string;
  location?: string;
  height?: string;
}

const TourMapInner = dynamic(() => import("./TourMapInner"), {
  ssr: false,
  loading: ({ style }: { style?: React.CSSProperties }) => (
    <div
      className="bg-gray-100 rounded-xl flex items-center justify-center"
      style={style || { height: "400px" }}
    >
      <div className="text-center text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2" />
        <p className="text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

export default function TourMap(props: TourMapProps) {
  return <TourMapInner {...props} />;
}
