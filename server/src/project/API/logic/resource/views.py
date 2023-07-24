from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from API.logic.resource.serializers import ResourceSerializer
from API.permissions import IsAuthorAndActive
from API.logic.functions import get_data
from API.logic.resource.services import create_resource
from API.models import Resource
from API.logic.file.services import create_file
from API.logic.group.services import create_group


class LCResourceView(APIView):
    serializer_class = ResourceSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        else:
            return [IsAuthorAndActive]

    def get(self, request):
        objects = Resource.objects.all()
        serializer = self.serializer_class(objects, many=True, context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = get_data(request)
        data['image'] = request.FILES.get('image')
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        response = create_resource(serializer.validated_data)
        if serializer.validated_data['type'] == 'file':
            files = request.FILES.getlist('files')
            create_file(files, response.data['id'])
        elif serializer.validated_data['type'] == 'group':
            create_group(response.data['id'])
        return response
