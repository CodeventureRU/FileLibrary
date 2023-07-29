from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class MyPaginationMixin(object):
    @property
    def paginator(self):
        if not hasattr(self, '_paginator'):
            if self.pagination_class is None:
                self._paginator = None
            else:
                self._paginator = self.pagination_class()
        return self._paginator

    def paginate_queryset(self, queryset):
        if self.paginator is None:
            return None
        return self.paginator.paginate_queryset(queryset, self.request, view=self)

    def get_paginated_response(self, data):
        assert self.paginator is not None
        return self.paginator.get_paginated_response(data)


class CustomPagination(PageNumberPagination):
    def get_page_number(self, request, paginator):
        page = request.query_params.get('page')
        if page is not None:
            try:
                return int(page)
            except ValueError:
                pass
        return super().get_page_number(request, paginator)

    def get_page_size(self, request):
        limit = request.query_params.get('limit')
        if limit is not None:
            try:
                return int(limit)
            except ValueError:
                pass
        return self.page_size

    def paginate_queryset(self, queryset, request, view=None):
        self.page_size = self.get_page_size(request)
        self.page_number = self.get_page_number(request, self)

        return super().paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        return Response({
            'num_pages': self.page.paginator.num_pages,
            'results': data
        })
