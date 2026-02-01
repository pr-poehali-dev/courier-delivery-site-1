import json
import os
import psycopg2
from datetime import datetime
import base64
import boto3

def handler(event: dict, context) -> dict:
    '''API для управления заказами доставки'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            tracking_number = query_params.get('tracking')
            
            if tracking_number:
                cur.execute('''
                    SELECT o.*, os.name as status_name, os.color as status_color,
                           pp_from.name as from_point, pp_to.name as to_point,
                           pp_to.city as to_city
                    FROM orders o
                    LEFT JOIN order_statuses os ON o.current_status_id = os.id
                    LEFT JOIN pickup_points pp_from ON o.pickup_point_from = pp_from.id
                    LEFT JOIN pickup_points pp_to ON o.pickup_point_to = pp_to.id
                    WHERE o.tracking_number = %s
                ''', (tracking_number,))
                
                row = cur.fetchone()
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заказ не найден'}),
                        'isBase64Encoded': False
                    }
                
                order = {
                    'id': row[0],
                    'tracking_number': row[1],
                    'customer_name': row[2],
                    'customer_phone': row[3],
                    'customer_email': row[4],
                    'pickup_point_from': row[5],
                    'pickup_point_to': row[6],
                    'delivery_type': row[7],
                    'delivery_address': row[8],
                    'weight': float(row[9]) if row[9] else None,
                    'length': float(row[10]) if row[10] else None,
                    'width': float(row[11]) if row[11] else None,
                    'height': float(row[12]) if row[12] else None,
                    'price': float(row[13]) if row[13] else None,
                    'qr_code_url': row[14],
                    'screenshot_url': row[15],
                    'current_status_id': row[16],
                    'notes': row[17],
                    'created_at': row[18].isoformat() if row[18] else None,
                    'updated_at': row[19].isoformat() if row[19] else None,
                    'status_name': row[20],
                    'status_color': row[21],
                    'from_point': row[22],
                    'to_point': row[23],
                    'to_city': row[24]
                }
                
                cur.execute('''
                    SELECT osh.*, os.name, os.color 
                    FROM order_status_history osh
                    LEFT JOIN order_statuses os ON osh.status_id = os.id
                    WHERE osh.order_id = %s
                    ORDER BY osh.created_at DESC
                ''', (order['id'],))
                
                history = []
                for h_row in cur.fetchall():
                    history.append({
                        'id': h_row[0],
                        'status_id': h_row[2],
                        'comment': h_row[3],
                        'created_at': h_row[4].isoformat() if h_row[4] else None,
                        'status_name': h_row[5],
                        'status_color': h_row[6]
                    })
                
                order['history'] = history
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(order),
                    'isBase64Encoded': False
                }
            else:
                cur.execute('''
                    SELECT o.id, o.tracking_number, o.customer_name, o.customer_phone,
                           o.weight, o.price, os.name as status_name, os.color as status_color,
                           o.created_at, pp_to.city as to_city
                    FROM orders o
                    LEFT JOIN order_statuses os ON o.current_status_id = os.id
                    LEFT JOIN pickup_points pp_to ON o.pickup_point_to = pp_to.id
                    ORDER BY o.created_at DESC
                    LIMIT 100
                ''')
                
                orders = []
                for row in cur.fetchall():
                    orders.append({
                        'id': row[0],
                        'tracking_number': row[1],
                        'customer_name': row[2],
                        'customer_phone': row[3],
                        'weight': float(row[4]) if row[4] else None,
                        'price': float(row[5]) if row[5] else None,
                        'status_name': row[6],
                        'status_color': row[7],
                        'created_at': row[8].isoformat() if row[8] else None,
                        'to_city': row[9]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'orders': orders}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            tracking_number = f"RA{datetime.now().strftime('%Y%m%d%H%M%S')}"
            
            qr_code_url = None
            screenshot_url = None
            
            if data.get('qr_code_base64'):
                s3 = boto3.client('s3',
                    endpoint_url='https://bucket.poehali.dev',
                    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
                )
                
                qr_data = base64.b64decode(data['qr_code_base64'])
                qr_key = f'orders/{tracking_number}_qr.png'
                s3.put_object(Bucket='files', Key=qr_key, Body=qr_data, ContentType='image/png')
                qr_code_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{qr_key}"
            
            if data.get('screenshot_base64'):
                s3 = boto3.client('s3',
                    endpoint_url='https://bucket.poehali.dev',
                    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
                )
                
                screenshot_data = base64.b64decode(data['screenshot_base64'])
                screenshot_key = f'orders/{tracking_number}_screen.png'
                s3.put_object(Bucket='files', Key=screenshot_key, Body=screenshot_data, ContentType='image/png')
                screenshot_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{screenshot_key}"
            
            cur.execute('''
                INSERT INTO orders (
                    tracking_number, customer_name, customer_phone, customer_email,
                    pickup_point_from, pickup_point_to, delivery_type, delivery_address,
                    weight, length, width, height, price, qr_code_url, screenshot_url,
                    current_status_id, notes
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 1, %s)
                RETURNING id
            ''', (
                tracking_number,
                data['customer_name'],
                data['customer_phone'],
                data.get('customer_email'),
                data['pickup_point_from'],
                data['pickup_point_to'],
                data['delivery_type'],
                data.get('delivery_address'),
                data['weight'],
                data.get('length'),
                data.get('width'),
                data.get('height'),
                data['price'],
                qr_code_url,
                screenshot_url,
                data.get('notes')
            ))
            
            order_id = cur.fetchone()[0]
            
            cur.execute('''
                INSERT INTO order_status_history (order_id, status_id, comment)
                VALUES (%s, 1, %s)
            ''', (order_id, 'Заказ создан'))
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'order_id': order_id,
                    'tracking_number': tracking_number
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            order_id = data.get('order_id')
            new_status_id = data.get('status_id')
            comment = data.get('comment', '')
            
            cur.execute('''
                UPDATE orders 
                SET current_status_id = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            ''', (new_status_id, order_id))
            
            cur.execute('''
                INSERT INTO order_status_history (order_id, status_id, comment)
                VALUES (%s, %s, %s)
            ''', (order_id, new_status_id, comment))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
