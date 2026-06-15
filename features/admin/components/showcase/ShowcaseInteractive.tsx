"use client";
/**
 * Component: ShowcaseInteractive — parte interativa da showcase do design system.
 *
 * Renderiza Tabs, Modals, Select, Input com estado local para QA visual.
 * Separado da page.tsx para manter Server Components onde possível.
 *
 * Usado em: src/app/admin/_showcase/page.tsx.
 */
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@features/admin/components/primitives/Button";
import { Input } from "@features/admin/components/primitives/Input";
import { Select } from "@features/admin/components/primitives/Select";
import { Modal } from "@features/admin/components/primitives/Modal";
import { Tabs } from "@features/admin/components/primitives/Tabs";
import { DateRangePicker, type DateRange } from "@features/admin/components/primitives/DateRangePicker";
import { HoloButton } from "@features/admin/components/motifs/HoloButton";

export default function ShowcaseInteractive() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectVal, setSelectVal] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [range, setRange] = useState<DateRange>({ from: "", to: "" });

  const selectOptions = [
    { value: "pending", label: "Pendente" },
    { value: "paid", label: "Pago" },
    { value: "shipped", label: "Enviado" },
    { value: "cancelled", label: "Cancelado" },
  ];

  const tabs = [
    { value: "buttons", label: "Buttons", content: <ButtonsTab /> },
    { value: "inputs", label: "Inputs", content: <InputsTab /> },
    { value: "misc", label: "Misc", content: null },
  ];

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30">Tabs</h2>
        <Tabs tabs={tabs} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30">Select</h2>
        <div className="max-w-xs">
          <Select
            label="Status do pedido"
            options={selectOptions}
            value={selectVal}
            onValueChange={setSelectVal}
            placeholder="Escolha um status..."
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30">Input</h2>
        <div className="max-w-xs flex flex-col gap-3">
          <Input
            label="Campo normal"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Digite aqui..."
          />
          <Input
            label="Com prefix"
            prefix={<Search size={15} />}
            placeholder="Buscar..."
          />
          <Input
            label="Com erro"
            error="Este campo é obrigatório"
            placeholder="Campo com erro"
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30">Date Range</h2>
        <DateRangePicker value={range} onChange={setRange} label="Período" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30">Modal</h2>
        <Button variant="ghost" onClick={() => setModalOpen(true)}>
          Abrir Modal
        </Button>
        <Modal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title="Confirmar Ação"
          description="Esta operação não pode ser desfeita"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="danger" size="sm" onClick={() => setModalOpen(false)}>
                Confirmar
              </Button>
            </>
          }
        >
          <p className="font-mono text-[13px] text-white/50">
            Tem certeza que deseja realizar esta ação?
          </p>
        </Modal>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30">
          Holo Button
        </h2>
        <HoloButton>
          <Plus size={19} />
          Ação Principal
        </HoloButton>
      </section>
    </div>
  );
}

function ButtonsTab() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="primary" size="sm">Primary SM</Button>
      <Button variant="primary" size="lg">Primary LG</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="primary" loading>Loading</Button>
      <Button variant="primary" disabled>Disabled</Button>
    </div>
  );
}

function InputsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      <Input label="Nome" placeholder="John Doe" />
      <Input label="E-mail" placeholder="john@example.com" />
      <Input label="Com hint" placeholder="..." hint="Mínimo 8 caracteres" />
      <Input label="Com erro" error="Campo obrigatório" placeholder="..." />
    </div>
  );
}
