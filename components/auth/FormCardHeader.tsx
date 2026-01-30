import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export const FormCardHeader = () => {
  const { i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <Image
        src="/logo.png"
        alt="RootsCampers Logo"
        width={64}
        height={64}
        className="rounded-full"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
            {i18n.language.toUpperCase()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => changeLanguage("en")}>
            English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage("es")}>
            Español
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage("pt")}>
            Português
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
