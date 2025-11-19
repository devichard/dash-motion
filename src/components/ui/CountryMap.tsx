// import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";
import dynamic from "next/dynamic";
import type React from "react";
import { useEffect, useRef, useState } from "react";

const VectorMap = dynamic(() => import("@react-jvectormap/core").then((mod) => mod.VectorMap), { ssr: false });

// Define the component props
interface CountryMapProps {
  mapColor?: string;
}

type MarkerStyle = {
  initial: {
    fill: string;
    r: number; // Radius for markers
  };
};

type Marker = {
  latLng: [number, number];
  name: string;
  style?: {
    fill: string;
    borderWidth: number;
    borderColor: string;
    stroke?: string;
    strokeOpacity?: number;
  };
};

const CountryMap: React.FC<CountryMapProps> = ({ mapColor }) => {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Aguardar o próximo frame para garantir que o container tenha dimensões
    const checkDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // Só renderizar se o container tiver dimensões válidas
        if (width > 0 && height > 0 && Number.isFinite(width) && Number.isFinite(height)) {
          setIsReady(true);
        } else {
          // Se ainda não tiver dimensões, tentar novamente
          requestAnimationFrame(checkDimensions);
        }
      }
    };

    // Aguardar um pouco antes de verificar para dar tempo do layout
    const timer = setTimeout(() => {
      checkDimensions();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[200px]">
      {!isReady ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground text-sm">Carregando mapa...</div>
        </div>
      ) : (
        <VectorMap
          map={worldMill}
          backgroundColor="transparent"
          markerStyle={
            {
              initial: {
                fill: "#4ca724",
                r: 4, // Custom radius for markers
              }, // Type assertion to bypass strict CSS property checks
            } as MarkerStyle
          }
          markersSelectable={true}
          markers={
            [
              {
                latLng: [37.2580397, -104.657039],
                name: "United States",
                style: {
                  fill: "var(--primary)",
                  borderWidth: 1,
                  borderColor: "white",
                  stroke: "#383f47",
                },
              },
              {
                latLng: [20.7504374, 73.7276105],
                name: "India",
                style: {
                  fill: "#4ca724",
                  borderWidth: 1,
                  borderColor: "white",
                },
              },
              {
                latLng: [53.613, -11.6368],
                name: "United Kingdom",
                style: {
                  fill: "#4ca724",
                  borderWidth: 1,
                  borderColor: "white",
                },
              },
              {
                latLng: [-25.0304388, 115.2092761],
                name: "Sweden",
                style: {
                  fill: "#4ca724",
                  borderWidth: 1,
                  borderColor: "white",
                  strokeOpacity: 0,
                },
              },
            ] as Marker[]
          }
          zoomOnScroll={false}
          zoomMax={12}
          zoomMin={1}
          zoomAnimate={true}
          zoomStep={1.5}
          regionStyle={{
            initial: {
              fill: mapColor || "var(--ring)",
              fillOpacity: 1,
              fontFamily: "Outfit",
              stroke: "none",
              strokeWidth: 0,
              strokeOpacity: 0,
            },
            hover: {
              fillOpacity: 0.7,
              cursor: "pointer",
              fill: "var(--primary)",
              stroke: "none",
            },
            selected: {
              fill: "#4ca724",
            },
            selectedHover: {},
          }}
          regionLabelStyle={{
            initial: {
              fill: "#35373e",
              fontWeight: 500,
              fontSize: "13px",
              stroke: "none",
            },
            hover: {},
            selected: {},
            selectedHover: {},
          }}
        />
      )}
    </div>
  );
};

export default CountryMap;
