import { LotStatus } from "@/types/parking";
import { API_BASE_URL } from "@/lib/constants";
import { getMockLotStatus } from "@/lib/mock-data";

export async function getLotStatus(lotId: string): Promise<LotStatus> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/lots/${lotId}/status`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  } catch {
    console.warn(`API unavailable for lot ${lotId}, using mock data`);
    return getMockLotStatus(lotId);
  }
}
