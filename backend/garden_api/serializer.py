from rest_framework import serializers
from .models import Plot

class PlotSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    title = serializers.CharField(allow_null=True, required=False)

    class Meta:
        model = Plot
        fields = ['id', 'user_name', 'title']  # Указываем нужные поля

    def get_user_name(self, obj):
        return obj.user.username