import { Router, Request, Response } from 'express';
import { supabase } from '../services/supabase';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * Rota protegida:
 * - Exige token JWT válido
 * - Exige header X-Unit
 * - Filtra dados financeiros por unidade
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    /**
     * 1️⃣ Ler a unidade do header
     */
    const unit = req.headers['x-unit'];

    /**
     * 2️⃣ Validar se o header foi enviado
     */
    if (!unit) {
      return res.status(400).json({
        error: 'Header X-Unit é obrigatório (learning ou lig)',
      });
    }

    /**
     * 3️⃣ Validar valor permitido
     */
    if (unit !== 'learning' && unit !== 'lig') {
      return res.status(400).json({
        error: 'Valor inválido para X-Unit. Use "learning" ou "lig".',
      });
    }

    /**
     * 4️⃣ Buscar dados no Supabase
     * ATENÇÃO: nome real da coluna é "unit or lig"
     */
    const { data, error } = await supabase
      .from('financial_summary')
      .select('*')
      .eq('unit or lig', unit)
      .single();

    if (error) {
      return res.status(500).json({
        error: 'Erro ao buscar dados financeiros',
        details: error.message,
      });
    }

    /**
     * 5️⃣ Retornar dados corretos
     */
    return res.json(data);
  } catch {
    return res.status(500).json({
      error: 'Erro inesperado no servidor',
    });
  }
});

export default router;
