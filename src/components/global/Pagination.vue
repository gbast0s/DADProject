<template>
    <nav aria-label="Page navigation example" v-if="meta && meta.last_page > 1" style="overflow-x:auto;">
        <ul class="pagination">
            <li :class=" meta.current_page == 1 ? 'page-item disabled' : 'page-item'"><a class="page-link" href="#" @click.prevent="changePage(meta.current_page != 1 ? meta.current_page - 1 : 1)">Previous</a></li>
            <li class="page-item" v-show="pages[0] != 1"><a class="page-link" href="#" @click.prevent="changePage(1)">1</a></li>
            <li class="page-item disabled" v-show="pages[0] != 1"><a class="page-link reticencias" href="#">...</a></li>
            <li :class="meta.current_page == page ? 'page-item  active' : 'page-item' " v-for="(page, value) in pages" :key="value">
                <a class="page-link" href="#" @click.prevent="changePage(page)">{{page}}</a>
            </li>
            <li class="page-item disabled" v-show="pages[pages.length - 1] != meta.last_page"><a class="page-link reticencias" href="#">...</a></li>
            <li class="page-item" v-show="pages[pages.length - 1] != meta.last_page"><a class="page-link" href="#" @click.prevent="changePage(meta.last_page)">{{meta.last_page}}</a></li>
            <li :class=" meta.current_page == meta.last_page ? 'page-item disabled' : 'page-item'"><a class="page-link" href="#" @click.prevent="changePage(meta.current_page <= meta.last_page ? meta.current_page + 1 : meta.last_page)">Next</a></li>
        </ul>
    </nav>
</template>

<script>
export default {
    data(){
        return {
            numShown: 8,
        }
    },
    props: {
        meta: {
            type: Object,
            default: null
        },
    },
    computed: {
        pages() {
           if(Object.keys(this.meta).length !== 0)
            {
                const numShown = Math.min(this.numShown, this.meta.last_page);
                let first = this.meta.current_page - Math.floor(numShown / 2);
                first = Math.max(first, 1);
                first = Math.min(first, this.meta.last_page - numShown + 1);
                return [...Array(numShown)].map((k,i) => i + first);   
           }
           return []
        }
    },
    methods: {
        changePage(page)
        {
            this.$emit('pagination', page)
        }
    }
}
</script>

<style scoped>
.page-item.active .page-link {
    background-color: #838383 !important;
    border-color: #838383 !important;
}

.page-link {
    color: #2b2c2e !important;
}

.page-item.active .page-link {
    z-index: 3;
    color: #fff !important;
}

.page-link:focus {
    box-shadow: 0 0 0 0.25rem rgb(43 43 43 / 25%);
}

.page-link:hover {
    color: #000000 !important;
}

.page-item.disabled .page-link {
    color: #6c757d !important;
}

a.page-link.reticencias{
    background-color: #e7e7e7;
}
</style>