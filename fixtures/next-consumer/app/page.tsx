import { BarbellIcon } from "@fradelli/ui/icons/Barbell";
import { ForkKnifeIcon } from "@fradelli/ui/icons";
import { Card } from "@fradelli/ui/card";
import { Button } from "@fradelli/ui/button";
import { ClientIcons } from "./client-icons";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <Card>
        <h1 className="fd-text-section">Server icon fixture</h1>
        <BarbellIcon size={24} data-server-icon="individual" aria-hidden="true" />
        <ForkKnifeIcon size={24} data-server-icon="aggregate" aria-hidden="true" />
        <Button data-hover-fixture>Primary hover</Button>
        <Button disabled data-disabled-fixture>
          Disabled hover
        </Button>
        <ClientIcons />
      </Card>
    </main>
  );
}
