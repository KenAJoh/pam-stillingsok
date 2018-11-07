import SearchApiError from './SearchApiError';

/* eslint-disable no-underscore-dangle */
import suggestionsTemplate from './templates/suggestionsTemplate';
import searchTemplate from './templates/searchTemplate';
import { SEARCH_API } from '../fasitProperties';

export async function get(url) {
    let response;
    try {
        response = await fetch(url, {
            method: 'GET'
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response.json();
}

export async function post(url, query) {
    let response;
    try {
        response = await fetch(url, {
            body: JSON.stringify(query),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response.json();
}

export async function put(url, query) {
    let response;
    try {
        response = await fetch(url, {
            body: JSON.stringify(query),
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response.json();
}

export async function remove(url) {
    let response;
    try {
        response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response;
}

function fixStilling(stilling) {
    if (stilling.properties === undefined) {
        return {
            ...stilling,
            properties: {}
        };
    }
    return stilling;
}

export async function fetchSearch(query = {}) {
    const result = await post(`${SEARCH_API}/stillingsok/ad/_search`, searchTemplate(query));
    return {
        stillinger: result.hits.hits.map((stilling) => (
            fixStilling(stilling._source)
        )),
        total: result.hits.total,
        counties: result.aggregations.counties.values.buckets.map((county) => ({
            key: county.key,
            count: county.doc_count,
            municipals: county.municipals.buckets.map((municipal) => ({
                key: `${county.key}.${municipal.key}`,
                label: municipal.key,
                count: municipal.doc_count
            }))
        })),
        occupationFirstLevels: result.aggregations.occupationFirstLevels.values.buckets.map((firstLevel) => ({
            key: firstLevel.key,
            count: firstLevel.doc_count,
            occupationSecondLevels: firstLevel.occupationSecondLevels.buckets.map((secondLevel) => ({
                key: `${firstLevel.key}.${secondLevel.key}`,
                label: secondLevel.key,
                count: secondLevel.doc_count
            }))
        })),
        extent: result.aggregations.extent.values.buckets.map((item) => ({
            key: item.key,
            count: item.doc_count
        })),
        engagementTypes: result.aggregations.engagementType.values.buckets.map((item) => ({
            key: item.key,
            count: item.doc_count
        })),
        sector: result.aggregations.sector.values.buckets.map((item) => ({
            key: item.key,
            count: item.doc_count
        })),
        published: result.aggregations.published.range.buckets.map((item) => ({
            key: item.key,
            count: item.doc_count
        }))
    };
}

export async function fetchCategoryAndSearchTagsSuggestions(match, minLength) {
    const result = await post(`${SEARCH_API}/stillingsok/ad/_search`, suggestionsTemplate(match, minLength));

    return {
        match,
        result: [...new Set([ // Bruker Set for å fjerne duplikater på tvers av category_suggest og searchtags_suggest
            ...result.suggest.category_suggest[0].options.map((suggestion) => suggestion.text),
            ...result.suggest.searchtags_suggest[0].options.map((suggestion) => suggestion.text)
        ].sort())]
    };
}

export async function fetchStilling(uuid) {
    return get(`${SEARCH_API}/stillingsok/ad/ad/${uuid}?_source_exclude=${{
        excludes: [
            'administration',
            'categoryList',
            'created',
            'createdBy',
            'employer',
            'expires',
            'geopoint',
            'location',
            'mediaList',
            'privacy',
            'properties.author',
            'properties.industry',
            'properties.keywords',
            'properties.occupation',
            'properties.searchtags',
            'properties.sourceupdated',
            'published',
            'updatedBy',
            'uuid'
        ]
    }.excludes.join(',')}`);
}
