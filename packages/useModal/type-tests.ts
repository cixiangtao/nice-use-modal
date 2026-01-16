import type { ModalProps } from "./index";
import { useModal } from "./index";

interface RequiredDataDefinition {
  data: { id: string };
}

interface OptionalDataDefinition {
  data?: { title?: string };
}

interface RequiredPropsDefinition {
  props: { onConfirm: () => void };
}

interface OptionalPropsDefinition {
  props?: { closeOnSuccess?: boolean };
}

interface CombinedDefinition {
  data: { id: string };
  props: { onSuccess: (id: string) => void };
}

function RequiredDataModal(_: ModalProps<RequiredDataDefinition>) {
  return null;
}

function OptionalDataModal(_: ModalProps<OptionalDataDefinition>) {
  return null;
}

function RequiredPropsModal(_: ModalProps<RequiredPropsDefinition>) {
  return null;
}

function OptionalPropsModal(_: ModalProps<OptionalPropsDefinition>) {
  return null;
}

function CombinedModal(_: ModalProps<CombinedDefinition>) {
  return null;
}

function EmptyModal(_: ModalProps) {
  return null;
}

function useTypeAssertions() {
  const requiredDataModal = useModal(RequiredDataModal);
  requiredDataModal.show({ id: "1" });
  // @ts-expect-error Required data must be passed to show.
  requiredDataModal.show();
  // @ts-expect-error A data-only modal does not accept hook props.
  useModal(RequiredDataModal, {});

  const optionalDataModal = useModal(OptionalDataModal);
  optionalDataModal.show();
  optionalDataModal.show({ title: "Create" });

  const requiredPropsModal = useModal(RequiredPropsModal, { onConfirm: () => undefined });
  requiredPropsModal.show();
  // @ts-expect-error Required hook props must be passed.
  useModal(RequiredPropsModal);
  // @ts-expect-error A props-only modal does not accept show data.
  requiredPropsModal.show({});

  const optionalPropsModal = useModal(OptionalPropsModal);
  optionalPropsModal.show();
  useModal(OptionalPropsModal, { closeOnSuccess: true });

  const combinedModal = useModal(CombinedModal, { onSuccess: () => undefined });
  combinedModal.show({ id: "1" });
  // @ts-expect-error Combined modal data is required.
  combinedModal.show();

  const emptyModal = useModal(EmptyModal);
  emptyModal.show();
  // @ts-expect-error Empty modal does not accept show data.
  emptyModal.show({});
}

void useTypeAssertions;
