import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";
import { Location } from "@/app/types/orderFilter";

interface LocationFilterProps {
  value: Location | null;
  onChange: (value: Location | null) => void;
  onClear: () => void;
}

const locations = [
  {
    country: "Lietuva",
    cities: ["Vilnius", "Kaunas", "Klaipėda", "Šiauliai", "Panevėžys"],
  },
  {
    country: "Latvija",
    cities: ["Ryga", "Daugpilis", "Liepoja"],
  },
  {
    country: "Estija",
    cities: ["Talinas", "Tartu", "Narva"],
  },
];

export const LocationFilter = ({
  value,
  onChange,
  onClear,
}: LocationFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLocationSelect = (country: string) => {
    onChange({ country, city: null });
    setError(null);
  };

  const handleCityConfirm = () => {
    if (!value?.country) {
      setError("Pasirinkite šalį");
      return;
    }
    onChange({ ...value, city: cityInput });
    setIsOpen(false);
    setError(null);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="border border-gray-300" asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center">
            <Globe className="h-4 w-4 mr-2 text-gray-700" />
            {value
              ? `${value.country}${value.city ? ` - ${value.city}` : ""}`
              : "Pasirinkite vietą"}
          </span>
          <span className="bg-gray-200 p-0.5 ml-2 rounded-sm">
            <ChevronDown className="h-4 w-4" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white" align="start">
        {locations.map((loc) => (
          <DropdownMenuSub key={loc.country}>
            <DropdownMenuSubTrigger
              className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleLocationSelect(loc.country)}
            >
              {loc.country}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-white p-2">
              <div className="flex flex-col gap-0">
                <Input
                  placeholder="Įveskite miestą"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className="mb-2"
                />
                <div className="flex flex-col gap-1">
                  <Button
                    variant="outline"
                    onClick={handleCityConfirm}
                    className="w-1/3 px-2 py-1 h-6 mb-1 bg-dcoffe hover:bg-vdcoffe text-db hover:text-gray-50 transition-colors"
                  >
                    Ok
                  </Button>
                  {error && (
                    <p className="text-red-500 text-sm ml-1">{error}</p>
                  )}
                </div>
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
        {value && (
          <DropdownMenuItem
            onClick={onClear}
            className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-gray-500"
          >
            Išvalyti vietą
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
