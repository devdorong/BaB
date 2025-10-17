import type { Matchings } from '../types/bobType';

interface MatchingContextValue {
  matchings: Matchings[];
  loading: boolean;
  selectedMatching: Matchings | null;
}
