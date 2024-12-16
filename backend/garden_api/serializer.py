from rest_framework import serializers
from .models import Plot, Bed, Plant

class PlotPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plot
        fields = ['title']

    def validate_title(self, value):
        user = self.context['user']
        if user.plot_set.filter(title=value).exists():
            raise serializers.ValidationError('Участок с таким именем существует')
        return value

    
class PlotGetSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    title = serializers.CharField(allow_null=True, required=False)

    class Meta:
        model = Plot
        fields = ['id', 'user_name', 'title']

    def get_user_name(self, obj):
        return obj.user.username
    
class BedListSerializer(serializers.ModelSerializer):
    plant = serializers.StringRelatedField()
    plot = serializers.StringRelatedField()

    class Meta:
        model = Bed
        fields = ['id', 'plot', 'plant', 'group', 'wet']
    
class NewBedSerializer(serializers.ModelSerializer):
    plant = serializers.CharField(required=False, allow_null=True)
    group = serializers.IntegerField(required=False, allow_null=True)  # Приводим к числовому типу
    wet = serializers.IntegerField(required=False, allow_null=True)  # Исправлено с BooleanField на IntegerField

    class Meta:
        model = Bed
        fields = ['plant', 'group', 'wet']

    def validate_plant(self, value):
        if value and not Plant.objects.filter(title=value).exists():
            raise serializers.ValidationError(f'Растение {value} не найдено')
        return value
    
    def create(self, validated_data):
        plot = self.context['plot']
        
        plant = None
        if validated_data.get('plant'):
            plant = Plant.objects.get(title=validated_data['plant'])
        
        group = validated_data.get('group', 0)  # Значение по умолчанию
        wet = validated_data.get('wet', 0)  # Значение по умолчанию

        return Bed.objects.create(
            plot=plot,
            plant=plant,
            group=group,
            wet=wet
        )
    
class BedUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bed
        fields = ['group', 'wet', 'info']

class PlantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plant
        fields = ['title', 'info']