<script lang="ts">
  import { Badge } from '$lib/components/ui/badge';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
  } from '$lib/components/ui/table';
  import dayjs from 'dayjs';

  let { data } = $props();
</script>

<h2 class="scroll-m-20 mb-4 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Users</h2>
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Username</TableHead>
      <TableHead>Join Date</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {#each data.users ?? [] as user}
      <TableRow>
        <TableCell>
          {user.name}
        </TableCell>
        <TableCell>{dayjs(user.createdAt).format('MMMM DD, YYYY')}</TableCell>
        <TableCell>
          {#each user.roles as role}
            <Badge>{role.name}</Badge>
          {/each}
        </TableCell>
      </TableRow>
    {/each}
  </TableBody>
</Table>
