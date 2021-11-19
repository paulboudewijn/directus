import { Sort } from '@/components/v-table/types';
import { sortBy } from 'lodash';
import { computed, ComputedRef, Ref, ref } from 'vue';
import { RelationInfo } from '@/composables/use-m2m';

type UsableSort = {
	sort: Ref<Sort>;
	sortItems: (newItems: Record<string, any>[]) => void;
	sortedItems: ComputedRef<Record<string, any>[]>;
};

export default function useSort(
	relation: Ref<RelationInfo>,
	fields: Ref<string[]>,
	items: Ref<Record<string, any>[]>,
	emit: (newVal: any[] | null) => void
): UsableSort {
	const sort = ref<Sort>({ by: relation.value.sortField || fields.value[0], desc: false });

	const sortedItems = computed(() => {
		const sFields: string[] = [...(relation.value.sortField ? [relation.value.sortField] : fields.value)];
		if (sFields.length == 0 ) return items.value;

		const desc = sort.value.desc;
		const sorted = sortBy(items.value, sFields);
		return desc ? sorted.reverse() : sorted;
	});

	return { sort, sortItems, sortedItems };

	function sortItems(newItems: Record<string, any>[]) {
		const sField = relation.value.sortField;
		if (sField === null) return;

		const itemsSorted = newItems.map((item, i) => {
			item[sField] = i;
			return item;
		});

		emit(itemsSorted);
	}
}
