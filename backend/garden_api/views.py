from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q

from auth_api.models import User
from .models import Plant, Plot, Bed
from .serializer import PlotSerializer

class NewPlot(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, user_id):
        title = request.data.get('title')
        user = User.objects.get(id=user_id)

        if user.plot_set.filter(title=title):
            return Response({'error':'Участок с таким именем уже есть'}, status=status.HTTP_400_BAD_REQUEST)
        
        plot = Plot(user=user, title=title)
        plot.save()
        data = {
            'message': 'Участок создан',
            'title': title,
        }
        return Response(data, status=status.HTTP_201_CREATED)
    
class PlotList(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, user_id):
        user = User.objects.get(id=user_id)
        plots = user.plot_set.all()
        serializer = PlotSerializer(plots, many=True)

        return Response(serializer.data)
        