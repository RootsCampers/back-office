"use client";

import { useState } from "react";
import { BecomeOwnerRequest } from "@/modules/profiles/domain";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageAlert } from "@/components/ui/message-alert";
import { useTranslation } from "react-i18next";

type BusinessInfo = BecomeOwnerRequest["business_info"];

type TouchedFields = {
  business_name: boolean;
  business_tax_id: boolean;
};

interface BusinessInfoStepProps {
  businessInfo: BusinessInfo;
  setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfo>>;
  personalTaxId: string;
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

export const BusinessInfoStep = ({
  businessInfo,
  setBusinessInfo,
  personalTaxId,
  messageAlert,
}: BusinessInfoStepProps) => {
  const { t } = useTranslation("become-host");
  const [touched, setTouched] = useState<TouchedFields>({
    business_name: false,
    business_tax_id: false,
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold cursor-default">
          {t("business_info.title", "Business Information")}
        </h3>
        <p className="text-muted-foreground cursor-default">
          {t("business_info.subtitle", "How do you want to invoice?")}
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
          <Label className="cursor-default">
            {t("business_info.business_type", "Business Type")}
          </Label>
          <div className="space-y-3 mt-2">
            <div className="flex items-center space-x-2">
              <Input
                type="radio"
                id="individual"
                name="businessType"
                value="individual"
                checked={businessInfo.type === "individual"}
                onChange={(e) =>
                  setBusinessInfo((prev: BusinessInfo) => ({
                    ...prev,
                    type: e.target.value as "individual" | "business",
                  }))
                }
                required
              />
              <Label
                htmlFor="individual"
                className="font-normal cursor-pointer"
              >
                <div>
                  <div className="font-medium cursor-default">
                    {t("business_info.particular", "Individual")}
                  </div>
                  <div className="text-sm text-muted-foreground cursor-default">
                    {t(
                      "business_info.particular_description",
                      "I invoice with my personal tax ID (DNI/RUT)",
                    )}
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Input
                type="radio"
                id="business"
                name="businessType"
                value="business"
                checked={businessInfo.type === "business"}
                onChange={(e) =>
                  setBusinessInfo((prev: BusinessInfo) => ({
                    ...prev,
                    type: e.target.value as "individual" | "business",
                  }))
                }
                required
              />
              <Label htmlFor="business" className="font-normal cursor-pointer">
                <div>
                  <div className="font-medium cursor-default">
                    {t("business_info.business", "Business")}
                  </div>
                  <div className="text-sm text-muted-foreground cursor-default">
                    {t(
                      "business_info.business_description",
                      "I have a business and invoice with a business tax ID",
                    )}
                  </div>
                </div>
              </Label>
            </div>
          </div>
        </div>

        {businessInfo.type === "business" && (
          <>
            <div>
              <Label htmlFor="businessName" className="cursor-default">
                {t("business_info.business_name", "Business Name (*)")}
              </Label>
              <Input
                id="businessName"
                value={businessInfo.name ?? ""}
                onChange={(e) =>
                  setBusinessInfo((prev: BusinessInfo) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, business_name: true }))
                }
                placeholder={t(
                  "business_info.business_name_placeholder",
                  "Enter your business name",
                )}
                className={
                  touched.business_name && !(businessInfo.name ?? "").trim()
                    ? "border-destructive"
                    : undefined
                }
              />
              {touched.business_name && !(businessInfo.name ?? "").trim() && (
                <p className="mt-1 text-sm text-destructive cursor-default">
                  {t(
                    "validation.business_name_required",
                    "Business name is required",
                  )}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="businessTaxId" className="cursor-default">
                {t("business_info.business_tax_id", "Business Tax ID (*)")}
              </Label>
              <Input
                id="businessTaxId"
                value={businessInfo.tax_id ?? ""}
                onChange={(e) =>
                  setBusinessInfo((prev: BusinessInfo) => ({
                    ...prev,
                    tax_id: e.target.value,
                  }))
                }
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, business_tax_id: true }))
                }
                placeholder={t(
                  "business_info.business_tax_id_placeholder",
                  "Enter your business tax ID",
                )}
                className={
                  touched.business_tax_id && !(businessInfo.tax_id ?? "").trim()
                    ? "border-destructive"
                    : undefined
                }
              />
              {touched.business_tax_id &&
                !(businessInfo.tax_id ?? "").trim() && (
                  <p className="mt-1 text-sm text-destructive cursor-default">
                    {t(
                      "validation.business_tax_id_required",
                      "Business tax ID is required",
                    )}
                  </p>
                )}
            </div>
          </>
        )}

        {businessInfo.type === "individual" && personalTaxId && (
          <div className="bg-blue-500/10 p-4 rounded-lg">
            <p className="text-sm text-blue-500 cursor-default">
              {t(
                "business_info.particular_note",
                "You will use your personal tax ID: {{taxId}}",
                { taxId: personalTaxId },
              )}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground cursor-default">
            {t("required_fields", "(*) Required fields")}
          </p>
        </div>
      </div>
    </div>
  );
};
