import { supabase } from "./supabase";

/**
 * Tipos de unidades aceitas pelo sistema
 */
export type FinanceUnit = "learning" | "lig";

/**
 * Estrutura do resumo financeiro
 */
export type FinanceSummary = {
  revenue: number;
  expenses: number;
  balance: number;
};

/**
 * Busca resumo financeiro.
 * - Se unit NÃO for informada → retorna o último resumo geral
 * - Se unit for informada → filtra por unidade
 */
export async function getFinanceSummary(
  unit?: FinanceUnit
): Promise<FinanceSummary> {
  let query = supabase
    .from("financial_summary")
    .select("revenue, expenses, balance")
    .order("created_at", { ascending: false })
    .limit(1);

  if (unit) {
    query = query.eq("unit", unit);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    throw new Error("Erro ao buscar dados financeiros");
  }

  return {
    revenue: data.revenue,
    expenses: data.expenses,
    balance: data.balance,
  };
}
