export async function getPhoneByPlaceId(placeId: string) {
  const res = await fetch(`https://place.map.kakao.com/main/v/${placeId}`, {
    method: 'GET',
  });

  const data = await res.json();

  return data?.basicInfo?.phonenum ?? null;
}