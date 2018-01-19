'use strict';

new Vue({
    el: '#app',
    data: function data() {
        return {
            species: [],
            dropdown: {height: 0},
            colors: {
                LC: [{background: "#066"}, {color: "#fff"}],
                NE: [{background: "#eee"}, {color: "#000"}],
                EN: [{background: "#c63"}, {color: "#fc9"}],
                EW: [{background: "#000"}, {color: "#fff"}],
                EX: [{background: "#000"}, {color: "#c33"}],
                NT: [{background: "#066"}, {color: "#9c9"}],
                VU: [{background: "#c90"}, {color: "#ffc"}],
                DD: [{background: "#fff"}, {color: "#000"}, {border: "1px solid #000"}],
                CR: [{background: "#c33"}, {color: "#fcc"}]
            },
            filters: {status: { EX:false, EW:false, CR:false, EN:false, VU:false, NT:false, LC:false, DD:false, NE:false}, group: {}},
            menus: {status: false, group: false}
        };
    },
    computed: {
        activeMenu: function activeMenu() {
            var _this = this;

            return Object.keys(this.menus).reduce(function ($$, set, i) {
                return _this.menus[set] ? i : $$;
            }, -1);
        },
        list: function list() {
            var _this2 = this;

            var _activeFilters = this.activeFilters;
            var group = _activeFilters.group;
            var status = _activeFilters.status;

            return this.species.filter(function (_ref) {
                var s = _ref.status;
                var g = _ref.group;

                if (status.length && !~status.indexOf(s)) return false;
                return !group.length || group.some(function (cat) {
                    return ~g.indexOf(cat);
                });
            });
        },
        activeFilters: function activeFilters() {
            var _filters = this.filters;
            var g = _filters.group;
            var s = _filters.status;

            return {
                group: Object.keys(g).filter(function (c) {
                    return g[c];
                }),
                status: Object.keys(s).filter(function (c) {
                    return s[c];
                })
            };
        }
    },

    watch: {
        activeMenu: function activeMenu(index) {
            var _this3 = this;

            this.$nextTick(function () {
                if (_this3.$refs.menu && _this3.$refs.menu[index]) {
                    _this3.dropdown.height = _this3.$refs.menu[index].clientHeight + 16 + 'px';
                } else {
                    _this3.dropdown.height = 0;
                }
            });
        }
    },

    methods: {
        setFilter: function setFilter(filter, option) {
            var _this4 = this;

            this.filters[filter][option] = !this.filters[filter][option];
        },
        clearFilter: function clearFilter(filter, except, active) {
            var _this5 = this;

            Object.keys(this.filters[filter]).forEach(function (option) {
                _this5.filters[filter][option] = except === option && !active;
            });
        },
        clearAllFilters: function clearAllFilters() {
            Object.keys(this.filters).forEach(this.clearFilter);
        },
        setMenu: function setMenu(menu, active) {
            var _this6 = this;

            Object.keys(this.menus).forEach(function (tab) {
                _this6.menus[tab] = !active && tab === menu;
            });
        }
    },

    beforeCreate: function beforeCreate() {
        var _this7 = this;

        fetch('amazing-species.json').then(function (response) {
            return response.json();
        }).then(function (species) {
            _this7.species = species;

            species.forEach(function (specie) {
                _this7.$set(_this7.filters.group, specie.group, false);
            });
        }).catch(function(error){
            console.log(error);
        });
    }
});