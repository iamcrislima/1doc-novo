export type ModalMode = "normal" | "expanded" | "fullscreen" | "minimized";

export interface NovoDocumentoModalProps {
  open: boolean;
  onClose: () => void;
}

export interface AssinaturaRow {
  ordem: string;
  assinante: string;
  papel: string;
  funcao: string;
}

export interface ArquivoItem {
  name: string;
  size: string;
  tipo: string;
}

export interface SecoesState {
  prazo: boolean;
  anexos: boolean;
  assinaturas: boolean;
}
