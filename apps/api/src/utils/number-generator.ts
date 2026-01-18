import { db } from "../config/database.js";
import { sql } from "drizzle-orm";

type DocumentType = "PR" | "PO" | "BPB" | "PV";

/**
 * Generate document numbers in format: TYPE/YYYY/MM/NNNN
 * e.g., PR/2026/01/0001
 */
export async function generateDocumentNumber(
    type: DocumentType
): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const prefix = `${type}/${year}/${month}/`;

    // Get the last number for this prefix
    let tableName: string;
    let numberColumn: string;

    switch (type) {
        case "PR":
            tableName = "purchase_requests";
            numberColumn = "pr_number";
            break;
        case "PO":
            tableName = "purchase_orders";
            numberColumn = "po_number";
            break;
        case "BPB":
            tableName = "goods_receipts";
            numberColumn = "bpb_number";
            break;
        case "PV":
            tableName = "payments";
            numberColumn = "voucher_number";
            break;
    }

    const result = await db.execute(
        sql.raw(`
      SELECT MAX(CAST(SUBSTRING(${numberColumn} FROM '[0-9]+$') AS INTEGER)) as last_num
      FROM ${tableName}
      WHERE ${numberColumn} LIKE '${prefix}%'
    `)
    );

    const lastNum = (result.rows[0] as any)?.last_num || 0;
    const nextNum = String(lastNum + 1).padStart(4, "0");

    return `${prefix}${nextNum}`;
}
