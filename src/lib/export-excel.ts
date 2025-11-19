import * as XLSX from "xlsx";

export interface ExcelReportData {
  "ID da empresa": string;
  "Razão Social": string;
  CNPJ: string;
  Telefone: string;
  "E-mail": string;
  "Total em vendas": string;
  "Saldo da empresa": string;
  Status: string;
  "Data de criação": string;
}

export interface TransactionsReportData {
  "ID da transação": string;
  Empresa: string;
  CNPJ: string;
  Produto: string;
  "Valor Total": string;
  "Valor do Produto": string;
  Quantidade: number;
  "Forma de Pagamento": string;
  "Criado em": string;
  Status: string;
}

export interface WithdrawalsReportData {
  "ID do saque": string;
  Empresa: string;
  CNPJ: string;
  Valor: string;
  Destino: string;
  "Criado em": string;
  Status: string;
}

export interface AnticipationsReportData {
  "ID da antecipação": string;
  Empresa: string;
  CNPJ: string;
  Valor: string;
  "Criado em": string;
  Status: string;
}

export function generateEnterpriseReport(data: ExcelReportData[], fileName: string = "relatorio-empresas") {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const columnWidths = [
    { wch: 15 },
    { wch: 35 },
    { wch: 20 },
    { wch: 18 },
    { wch: 30 },
    { wch: 18 },
    { wch: 18 },
    { wch: 12 },
    { wch: 20 },
  ];
  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Empresas");

  const timestamp = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${fileName}-${timestamp}.xlsx`);
}

export function generateTransactionsReport(data: TransactionsReportData[], fileName: string = "relatorio-transacoes") {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const columnWidths = [
    { wch: 18 },
    { wch: 30 },
    { wch: 20 },
    { wch: 30 },
    { wch: 15 },
    { wch: 18 },
    { wch: 12 },
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
  ];
  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transações");

  const timestamp = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${fileName}-${timestamp}.xlsx`);
}

export function generateWithdrawalsReport(data: WithdrawalsReportData[], fileName: string = "relatorio-saques") {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const columnWidths = [{ wch: 18 }, { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 35 }, { wch: 20 }, { wch: 15 }];
  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Saques");

  const timestamp = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${fileName}-${timestamp}.xlsx`);
}

export function generateAnticipationsReport(
  data: AnticipationsReportData[],
  fileName: string = "relatorio-antecipacoes",
) {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const columnWidths = [{ wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];
  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Antecipações");

  const timestamp = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${fileName}-${timestamp}.xlsx`);
}
