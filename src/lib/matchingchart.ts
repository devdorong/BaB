import dayjs from 'dayjs';
import { supabase } from './supabase';

export const fetchMatchingStatus = async () => {
  const { data, error } = await supabase.from('matchings').select('status');

  if (error) throw error;

  const counts = data.reduce(
    (acc, cur) => {
      if (cur.status === 'cancel') acc.cancel++;
      else if (cur.status === 'waiting') acc.waiting++;
      else if (cur.status === 'completed') acc.completed++;
      return acc;
    },
    { cancel: 0, waiting: 0, completed: 0 },
  );

  const total = counts.cancel + counts.waiting + counts.completed;
  const percentages = {
    cancel: ((counts.cancel / total) * 100).toFixed(1),
    waiting: ((counts.waiting / total) * 100).toFixed(1),
    completed: ((counts.completed / total) * 100).toFixed(1),
  };
  return { counts, percentages };
};

export const fetchMonthlyMatchings = async () => {
  const { data, error } = await supabase.from('matchings').select('created_at');

  if (error) {
    console.error('Supabase error:', error.message);
    return { labels: [], counts: [] }; // 안전하게 빈값 리턴
  }

  if (!data || data.length === 0) {
    console.warn('matchings 데이터가 없습니다.');
    return { labels: [], counts: [] };
  }

  // 월별 그룹핑
  const monthlyCounts: Record<string, number> = {};
  data.forEach(item => {
    const month = dayjs(item.created_at).format('YYYY-MM');
    monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
  });

  // 정렬
  const sortedMonths = Object.keys(monthlyCounts).sort();

  return {
    labels: sortedMonths,
    counts: sortedMonths.map(month => monthlyCounts[month]),
  };
};
