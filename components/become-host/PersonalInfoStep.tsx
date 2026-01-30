import type {
  BecomeOwnerRequest,
  LanguageInfo,
} from "@/modules/profiles/domain";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CountrySelector } from "@/components/ui/country-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageAlert } from "@/components/ui/message-alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

type PersonalInfo = BecomeOwnerRequest["personal_info"];

interface PersonalInfoStepProps {
  personalInfo: PersonalInfo;
  setPersonalInfo: React.Dispatch<React.SetStateAction<PersonalInfo>>;
  messageAlert: {
    title: string;
    description: string;
  } | null;
  setMessageAlert: (
    value: {
      title: string;
      description: string;
    } | null,
  ) => void;
}

const LANGUAGE_OPTIONS = [
  "Spanish",
  "English",
  "Portuguese",
  "French",
  "German",
  "Italian",
  "Other",
];

const LEVEL_OPTIONS = ["Basic", "Intermediate", "Advanced", "Native"];

type TouchedFields = {
  full_name: boolean;
  personal_tax_id: boolean;
  nationality: boolean;
};

export const PersonalInfoStep = ({
  personalInfo,
  setPersonalInfo,
  messageAlert,
}: PersonalInfoStepProps) => {
  const { t } = useTranslation("become-host");
  const [touched, setTouched] = useState<TouchedFields>({
    full_name: false,
    personal_tax_id: false,
    nationality: false,
  });

  const addLanguage = () => {
    setPersonalInfo((prev: PersonalInfo) => ({
      ...prev,
      languages: [...prev.languages, { language: "", level: "" }],
    }));
  };

  const removeLanguage = (index: number) => {
    setPersonalInfo((prev: PersonalInfo) => ({
      ...prev,
      languages: prev.languages.filter(
        (_: LanguageInfo, i: number) => i !== index,
      ),
    }));
  };

  const updateLanguage = (
    index: number,
    field: "language" | "level",
    value: string,
  ) => {
    setPersonalInfo((prev: PersonalInfo) => ({
      ...prev,
      languages: prev.languages.map((lang: LanguageInfo, i: number) =>
        i === index ? { ...lang, [field]: value } : lang,
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold cursor-default">
          {t("personal_info.title", "Personal Information")}
        </h3>
        <p className="text-muted-foreground cursor-default">
          {t("personal_info.subtitle", "Tell us about yourself")}
        </p>
      </div>

      {messageAlert && (
        <MessageAlert
          type="error"
          title={messageAlert.title}
          description={messageAlert.description}
        />
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">
            {t("personal_info.full_name", "Full Name (*)")}
          </Label>
          <Input
            id="fullName"
            value={personalInfo.full_name}
            onChange={(e) =>
              setPersonalInfo((prev) => ({
                ...prev,
                full_name: e.target.value,
              }))
            }
            onBlur={() => setTouched((prev) => ({ ...prev, full_name: true }))}
            placeholder={t(
              "personal_info.full_name_placeholder",
              "Enter your full name",
            )}
            required
            className={
              touched.full_name && !personalInfo.full_name.trim()
                ? "border-destructive"
                : undefined
            }
          />
          {touched.full_name && !personalInfo.full_name.trim() && (
            <p className="mt-1 text-sm text-destructive">
              {t("validation.full_name_required", "Full name is required")}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="birthDate">
            {t("personal_info.birth_date", "Birth Date")}
          </Label>
          <Input
            id="birthDate"
            type="date"
            value={personalInfo.birth_date || ""}
            onChange={(e) =>
              setPersonalInfo((prev) => ({
                ...prev,
                birth_date: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <Label htmlFor="personalTaxId">
            {t("personal_info.tax_id", "Tax ID / DNI / RUT (*)")}
          </Label>
          <Input
            id="personalTaxId"
            value={personalInfo.personal_tax_id}
            onChange={(e) =>
              setPersonalInfo((prev) => ({
                ...prev,
                personal_tax_id: e.target.value,
              }))
            }
            onBlur={() =>
              setTouched((prev) => ({ ...prev, personal_tax_id: true }))
            }
            placeholder={t(
              "personal_info.tax_id_placeholder",
              "Enter your personal tax ID",
            )}
            required
            className={
              touched.personal_tax_id && !personalInfo.personal_tax_id.trim()
                ? "border-destructive"
                : undefined
            }
          />
          {touched.personal_tax_id && !personalInfo.personal_tax_id.trim() && (
            <p className="mt-1 text-sm text-destructive">
              {t("validation.tax_id_required", "Tax ID is required")}
            </p>
          )}
        </div>

        <div
          onBlur={() => setTouched((prev) => ({ ...prev, nationality: true }))}
        >
          <Label htmlFor="country">
            {t("personal_info.country", "Country of Origin (*)")}
          </Label>
          <CountrySelector
            value={personalInfo.nationality}
            onValueChange={(value) => {
              setPersonalInfo((prev) => ({ ...prev, nationality: value }));
              setTouched((prev) => ({ ...prev, nationality: true }));
            }}
            placeholder={t(
              "personal_info.select_country",
              "Select your country of origin",
            )}
          />
          {touched.nationality && !personalInfo.nationality.trim() && (
            <p className="mt-1 text-sm text-destructive">
              {t(
                "validation.country_required",
                "Country of origin is required",
              )}
            </p>
          )}
        </div>

        <div>
          <Label>{t("personal_info.languages")}</Label>
          <div className="space-y-2">
            {personalInfo.languages.map((lang, index) => (
              <div key={index} className="flex gap-2">
                <Select
                  value={lang.language}
                  onValueChange={(value) =>
                    updateLanguage(index, "language", value)
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue
                      placeholder={t(
                        "personal_info.select_language",
                        "Select language",
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((language) => (
                      <SelectItem key={language} value={language}>
                        {t(`languages.${language.toLowerCase()}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={lang.level}
                  onValueChange={(value) =>
                    updateLanguage(index, "level", value)
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue
                      placeholder={t(
                        "personal_info.select_level",
                        "Select level",
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVEL_OPTIONS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {t(`language_levels.${level.toLowerCase()}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {personalInfo.languages.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLanguage(index)}
                  >
                    {t("common.remove", "Remove")}
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLanguage}
              className="w-full"
            >
              {t("personal_info.add_language", "Add Language")}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground cursor-default">
            {t("required_fields", "(*) Required fields")}
          </p>
        </div>
      </div>
    </div>
  );
};
