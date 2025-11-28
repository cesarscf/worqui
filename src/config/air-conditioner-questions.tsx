import {
  AirVentIcon,
  AlertCircleIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  ShieldCheckIcon,
  ToolCaseIcon,
  WrenchIcon,
  XCircleIcon,
} from "lucide-react"

export interface QuestionOption {
  value: string
  label: string
  icon: React.ReactNode
}

export interface QuestionStep {
  id: string
  title: string
  description: string
  fieldName: string
  options?: QuestionOption[]
  type: "radio" | "textarea"
}

export const airConditionerQuestions: QuestionStep[] = [
  {
    id: "deviceBrand",
    title: "Marca do Aparelho",
    description: "Selecione a marca do ar condicionado",
    fieldName: "deviceBrand",
    type: "radio",
    options: [
      { value: "Brastemp", label: "Brastemp", icon: <AirVentIcon /> },
      { value: "Consul", label: "Consul", icon: <AirVentIcon /> },
      { value: "Electrolux", label: "Electrolux", icon: <AirVentIcon /> },
      { value: "Elgin", label: "Elgin", icon: <AirVentIcon /> },
      { value: "Fujitsu", label: "Fujitsu", icon: <AirVentIcon /> },
      { value: "Gree", label: "Gree", icon: <AirVentIcon /> },
      { value: "Komeco", label: "Komeco", icon: <AirVentIcon /> },
      { value: "LG", label: "LG", icon: <AirVentIcon /> },
      { value: "Midea", label: "Midea", icon: <AirVentIcon /> },
      { value: "Philco", label: "Philco", icon: <AirVentIcon /> },
      { value: "Samsung", label: "Samsung", icon: <AirVentIcon /> },
      {
        value: "Springer Carrier",
        label: "Springer Carrier",
        icon: <AirVentIcon />,
      },
      { value: "York", label: "York", icon: <AirVentIcon /> },
      { value: "Outras", label: "Outras", icon: <AirVentIcon /> },
    ],
  },
  {
    id: "warrantyStatus",
    title: "Status da Garantia",
    description: "O aparelho está na garantia?",
    fieldName: "warrantyStatus",
    type: "radio",
    options: [
      {
        value: "Dentro da garantia",
        label: "Dentro da garantia",
        icon: <ShieldCheckIcon />,
      },
      {
        value: "Fora da garantia",
        label: "Fora da garantia",
        icon: <XCircleIcon />,
      },
    ],
  },
  {
    id: "serviceType",
    title: "Tipo de Serviço",
    description: "Qual tipo de serviço você precisa?",
    fieldName: "serviceType",
    type: "radio",
    options: [
      {
        value: "Manutenção",
        label: "Manutenção",
        icon: <WrenchIcon />,
      },
      {
        value: "Instalação",
        label: "Instalação",
        icon: <ToolCaseIcon />,
      },
    ],
  },
  {
    id: "issueCategory",
    title: "Categoria do Problema",
    description: "Descreva o problema do aparelho",
    fieldName: "issueCategory",
    type: "radio",
    options: [
      {
        value: "Não, apenas instalação do ar condicionado",
        label: "Não, apenas instalação do ar condicionado",
        icon: <ToolCaseIcon />,
      },
      {
        value: "Barulho excessivo",
        label: "Barulho excessivo",
        icon: <AlertCircleIcon />,
      },
      {
        value: "Controle com problema",
        label: "Controle com problema",
        icon: <XCircleIcon />,
      },
      {
        value: "Desliga sozinho",
        label: "Desliga sozinho",
        icon: <ClockIcon />,
      },
      {
        value: "Não liga",
        label: "Não liga",
        icon: <XCircleIcon />,
      },
      {
        value: "Higienização",
        label: "Higienização",
        icon: <CheckCircle2Icon />,
      },
      {
        value: "Troca de filtro",
        label: "Troca de filtro",
        icon: <CheckCircle2Icon />,
      },
      {
        value: "Vazamento",
        label: "Vazamento",
        icon: <AlertCircleIcon />,
      },
      {
        value: "Outro",
        label: "Outro",
        icon: <WrenchIcon />,
      },
    ],
  },
  {
    id: "urgencyLevel",
    title: "Urgência",
    description: "Qual a urgência do atendimento?",
    fieldName: "urgencyLevel",
    type: "radio",
    options: [
      {
        value: "Não tenho data definida",
        label: "Não tenho data definida",
        icon: <CalendarIcon />,
      },
      {
        value: "Urgente",
        label: "Urgente",
        icon: <AlertCircleIcon />,
      },
      {
        value: "Nos próximos 7 dias",
        label: "Nos próximos 7 dias",
        icon: <CalendarIcon />,
      },
      {
        value: "Nos próximos 15 dias",
        label: "Nos próximos 15 dias",
        icon: <CalendarIcon />,
      },
      {
        value: "Nos próximos 30 dias",
        label: "Nos próximos 30 dias",
        icon: <CalendarIcon />,
      },
    ],
  },
  {
    id: "additionalInfo",
    title: "Informações Adicionais",
    description: "Deseja adicionar mais alguma informação?",
    fieldName: "additionalInfo",
    type: "textarea",
  },
]
