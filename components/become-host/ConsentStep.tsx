import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TermsAndConditions } from "@/components/ui/terms-and-conditions";
import { useTranslation } from "react-i18next";

interface ConsentStepProps {
  accepted: boolean;
  setAccepted: (accepted: boolean) => void;
}

export const ConsentStep = ({ accepted, setAccepted }: ConsentStepProps) => {
  const { t } = useTranslation(["become-host", "auth-and-terms"]);

  return (
    <div>
      <div className="space-y-2 bg-muted p-4 rounded-lg mb-4">
        <h3 className="font-semibold cursor-default">
          {t("consent.title", "Platform Terms")}
        </h3>
        <ul className="list-disc list-inside space-y-2 text-sm cursor-default">
          <li>
            {t(
              "consent.point1",
              "RootsCampers is a marketplace for travelers to find campers from camper owners",
            )}
          </li>
          <li>
            {t(
              "consent.point2",
              "RootsCampers only provides the platform for sharing, showcasing, managing and contacting owners and renters",
            )}
          </li>
          <li>
            {t(
              "consent.point3",
              "Any business conducted here is solely responsibility of the camper owner and the renter",
            )}
          </li>
          <li>
            {t(
              "consent.point4",
              "RootsCampers offers the tools, platform and partnerships to help YOU make this with security, ease and technology",
            )}
          </li>
        </ul>
      </div>

      {/* Terms and Conditions Acceptance */}
      <div className="flex items-start space-x-2 p-4 rounded-lg bg-blue-50">
        <Checkbox
          id="terms"
          checked={accepted}
          onCheckedChange={(checked) => setAccepted(checked as boolean)}
          className="mt-0.5"
        />
        <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
          <TermsAndConditions type="host">
            {t("terms.host_terms.read_terms", { ns: "auth-and-terms" })}
          </TermsAndConditions>
          <div className="mt-1 cursor-default">
            {t("terms.host_terms.accept_terms", { ns: "auth-and-terms" })}
          </div>
          <div className="mt-1 text-xs cursor-default">
            <span className="font-medium">(*)</span>{" "}
            {t("terms.host_terms.must_accept", { ns: "auth-and-terms" })}
          </div>
        </Label>
      </div>
    </div>
  );
};
