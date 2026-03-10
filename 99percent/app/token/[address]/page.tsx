import { getToken, getComments } from '@/lib/api'
import { notFound } from 'next/navigation'
import TokenPageClient from './TokenPageClient'

export default async function TokenPage({ params }: { params: { address: string } }) {
  const token = await getToken(params.address)
  if (!token) notFound()
  const comments = await getComments(params.address)
  return <TokenPageClient token={token} comments={comments} address={params.address} />
}
