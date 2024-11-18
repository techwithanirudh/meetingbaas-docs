import { OramaClient } from '@oramacloud/client';
import type { SharedProps } from 'fumadocs-ui/components/dialog/search';
import SearchDialog from 'fumadocs-ui/components/dialog/search-orama';
import { useMode } from '@/app/layout.client';


const client = new OramaClient({
  endpoint: process.env.NEXT_PUBLIC_ORAMA_SEARCH_ENDPOINT!,
  api_key: process.env.NEXT_PUBLIC_ORAMA_SEARCH_API_KEY!,
});
 
export default function CustomSearchDialog(
  props: SharedProps,
): React.ReactElement {
  return (
    <SearchDialog
      {...props}
      defaultTag={useMode() ?? 'ui'}
      allowClear
      tags={[
        {
          name: 'API',
          value: 'api',
        },
        {
          name: 'Transcript Seeker',
          value: 'transcript-seeker',
        },
        {
          name: 'Speaking Bots',
          value: 'speaking-bots',
        },
      ]}
      client={client}
      showOrama
    />
  );
}