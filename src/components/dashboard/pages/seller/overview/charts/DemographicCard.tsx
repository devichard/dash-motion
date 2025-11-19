"use client";
import Image from "next/image";

import CountryMap from "@/components/ui/CountryMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function DemographicCard() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex items-center justify-between border-b sm:flex-row">
        <div>
          <CardTitle className="text-base font-medium">Vendas Globais</CardTitle>
          <CardDescription className="text-xs">Acompanhe em tempo real suas vendas</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          Veja Todas
        </Button>
      </CardHeader>
      <CardContent className="pb-2 flex-1 flex flex-col min-h-[200px]">
        <div id="mapOne" className="mapOne map-btn flex-1 w-full min-h-[200px]">
          <CountryMap />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="items-center w-full rounded-full max-w-8">
              <Image
                width={62}
                height={62}
                className="w-full"
                src="https://static.significados.com.br/flags/br.svg"
                alt="brazil"
              />
            </div>
            <div>
              <h3 className="font-medium">Brazil</h3>
              <span className="text-xs text-muted-foreground">589 Clientes</span>
            </div>
          </div>

          <div className="flex w-full max-w-[140px] items-center gap-3">
            <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-primary/20">
              <div className="absolute left-0 top-0 flex h-full w-[23%] items-center justify-center rounded-sm bg-primary text-xs font-medium text-white"></div>
            </div>
            <p>23%</p>
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="items-center w-full rounded-full max-w-8">
              <Image
                width={48}
                height={48}
                className="w-full"
                src="https://static.significados.com.br/flags/us.svg"
                alt="usa"
              />
            </div>
            <div>
              <h3 className="font-medium">USA</h3>
              <span className="text-xs text-muted-foreground">589 Clientes</span>
            </div>
          </div>

          <div className="flex w-full max-w-[140px] items-center gap-3">
            <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-primary/20">
              <div className="absolute left-0 top-0 flex h-full w-[23%] items-center justify-center rounded-sm bg-primary text-xs font-medium text-white"></div>
            </div>
            <p>23%</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
